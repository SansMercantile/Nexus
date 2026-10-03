using System.Diagnostics;
using System.ComponentModel;
using System.IO;
using System.Reflection;
using System.Windows;
using System.Windows.Input;

namespace PrivCoreInstaller;

public partial class MainWindow : Window
{
    private const string SetupEngineResource = "PrivCoreInstaller.Payload.SetupEngine.exe";
    private const string PrivUrl = "https://priv.sansmercantile.com";
    private int _agreementStage;
    private Process? _installerProcess;
    private string? _enginePath;
    private bool _installationSucceeded;

    public MainWindow()
    {
        InitializeComponent();
        AgreementText.Text = ReadTextResource("PrivCoreInstaller.Legal.EULA.txt");
    }

    private void TitleBar_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
    {
        if (e.ButtonState == MouseButtonState.Pressed)
        {
            DragMove();
        }
    }

    private void CloseButton_Click(object sender, RoutedEventArgs e)
    {
        if (_installerProcess is { HasExited: false })
        {
            return;
        }

        Close();
    }

    private void Window_Closing(object? sender, CancelEventArgs e)
    {
        if (_installerProcess is { HasExited: false })
        {
            e.Cancel = true;
        }
    }

    private void InstallButton_Click(object sender, RoutedEventArgs e)
    {
        _agreementStage = 0;
        AgreementTitle.Text = "End User License Agreement";
        AgreementSubtitle.Text = "Review the agreement to continue.";
        AgreementText.Text = ReadTextResource("PrivCoreInstaller.Legal.EULA.txt");
        AcceptCheckBox.Content = "I have read and accept this agreement";
        AcceptCheckBox.IsChecked = false;
        StartOnLogonCheckBox.Visibility = Visibility.Collapsed;
        ContinueButton.Content = "Continue";
        WelcomePage.Visibility = Visibility.Collapsed;
        AgreementPage.Visibility = Visibility.Visible;
    }

    private void AcceptCheckBox_Changed(object sender, RoutedEventArgs e)
    {
        ContinueButton.IsEnabled = AcceptCheckBox.IsChecked == true;
    }

    private void BackButton_Click(object sender, RoutedEventArgs e)
    {
        if (_agreementStage == 1)
        {
            _agreementStage = 0;
            AgreementTitle.Text = "End User License Agreement";
            AgreementSubtitle.Text = "Review the agreement to continue.";
            AgreementText.Text = ReadTextResource("PrivCoreInstaller.Legal.EULA.txt");
            AcceptCheckBox.Content = "I have read and accept this agreement";
            AcceptCheckBox.IsChecked = false;
            StartOnLogonCheckBox.Visibility = Visibility.Collapsed;
            ContinueButton.Content = "Continue";
            return;
        }

        AgreementPage.Visibility = Visibility.Collapsed;
        WelcomePage.Visibility = Visibility.Visible;
    }

    private async void ContinueButton_Click(object sender, RoutedEventArgs e)
    {
        if (AcceptCheckBox.IsChecked != true)
        {
            return;
        }

        if (_agreementStage == 0)
        {
            _agreementStage = 1;
            AgreementTitle.Text = "Terms and Conditions";
            AgreementSubtitle.Text = "Review and accept the terms to install Priv Core.";
            AgreementText.Text = ReadTextResource("PrivCoreInstaller.Legal.TERMS.txt");
            AcceptCheckBox.Content = "I have read and accept these terms";
            AcceptCheckBox.IsChecked = false;
            StartOnLogonCheckBox.Visibility = Visibility.Visible;
            ContinueButton.Content = "Install";
            return;
        }

        AgreementPage.Visibility = Visibility.Collapsed;
        ProgressPage.Visibility = Visibility.Visible;
        CloseButton.IsEnabled = false;
        CancelInstallButton.Content = "Installing...";
        CancelInstallButton.IsEnabled = false;
        ProgressStatus.Text = "Preparing the Priv Core package...";
        InstallProgress.IsIndeterminate = true;
        ProgressPercent.Text = "Please keep this window open";

        try
        {
            await RunSetupEngineAsync();
                var installerProcess = _installerProcess;
                if (installerProcess is null || installerProcess.ExitCode != 0)
            {
                throw new InvalidOperationException(
                    $"The setup engine exited with code {installerProcess?.ExitCode ?? -1}.");
            }

            var installDirectory = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Priv", "Core");
            Directory.CreateDirectory(installDirectory);
            File.WriteAllText(
                Path.Combine(installDirectory, "agreement-acceptance.txt"),
                $"EULA and Terms accepted by {Environment.UserName} at {DateTimeOffset.Now:O}{Environment.NewLine}");

            _installationSucceeded = true;
            ProgressStatus.Text = "Priv Core is installed and ready to pair with MetaTrader 5.";
            InstallProgress.IsIndeterminate = false;
            InstallProgress.Value = 100;
            ProgressPercent.Text = "Complete";
            CancelInstallButton.Content = "Finish";
            CancelInstallButton.IsEnabled = true;
            CloseButton.IsEnabled = true;
        }
        catch (Exception ex)
        {
            ProgressStatus.Text = $"Installation failed: {ex.Message}";
            InstallProgress.IsIndeterminate = false;
            ProgressPercent.Text = "Setup did not complete";
            CancelInstallButton.Content = "Close";
            CancelInstallButton.IsEnabled = true;
            CloseButton.IsEnabled = true;
        }
        finally
        {
            _installerProcess?.Dispose();
            _installerProcess = null;
            if (_enginePath is not null)
            {
                try
                {
                    File.Delete(_enginePath);
                }
                catch (IOException)
                {
                }
                catch (UnauthorizedAccessException)
                {
                }
            }
        }
    }

    private async Task RunSetupEngineAsync()
    {
        _enginePath = Path.Combine(Path.GetTempPath(), $"PrivCoreSetupEngine-{Guid.NewGuid():N}.exe");
        await using (var resource = Assembly.GetExecutingAssembly()
            .GetManifestResourceStream(SetupEngineResource)
            ?? throw new FileNotFoundException("The Priv Core setup engine is missing from this package."))
        await using (var destination = File.Create(_enginePath))
        {
            await resource.CopyToAsync(destination);
        }

        ProgressStatus.Text = "Installing Priv Core and configuring the MT5 bridge...";
        var startInfo = new ProcessStartInfo
        {
            FileName = _enginePath,
            UseShellExecute = false,
            CreateNoWindow = true,
        };
        startInfo.ArgumentList.Add("/VERYSILENT");
        startInfo.ArgumentList.Add("/SUPPRESSMSGBOXES");
        startInfo.ArgumentList.Add("/NORESTART");
        startInfo.ArgumentList.Add("/SP-");
        startInfo.ArgumentList.Add(StartOnLogonCheckBox.IsChecked == true
            ? "/TASKS=logontask"
            : "/TASKS=!logontask");
        startInfo.ArgumentList.Add($"/LOG={Path.Combine(Path.GetTempPath(), "PrivCoreSetup.log")}");

        _installerProcess = new Process { StartInfo = startInfo };
        if (!_installerProcess.Start())
        {
            throw new InvalidOperationException("Windows could not start the Priv Core setup engine.");
        }

        await _installerProcess.WaitForExitAsync();
    }

    private void CancelInstallButton_Click(object sender, RoutedEventArgs e)
    {
        if (_installerProcess is { HasExited: false })
        {
            return;
        }

        if (_installationSucceeded)
        {
            Process.Start(new ProcessStartInfo(PrivUrl) { UseShellExecute = true });
        }

        Close();
    }

    private static string ReadTextResource(string resourceName)
    {
        using var resource = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName)
            ?? throw new FileNotFoundException($"The installer resource '{resourceName}' is missing.");
        using var reader = new StreamReader(resource);
        return reader.ReadToEnd();
    }
}