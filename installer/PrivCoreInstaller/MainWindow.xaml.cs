using System.Windows;
using System.Windows.Input;

namespace PrivCoreInstaller;

public partial class MainWindow : Window
{
    public MainWindow()
    {
        InitializeComponent();
    }

    private void TitleBar_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
    {
        if (e.ButtonState == MouseButtonState.Pressed)
        {
            DragMove();
        }
    }

    private void CloseButton_Click(object sender, RoutedEventArgs e) => Close();

    private void InstallButton_Click(object sender, RoutedEventArgs e)
    {
        WelcomePage.Visibility = Visibility.Collapsed;
        AgreementPage.Visibility = Visibility.Visible;
    }

    private void AcceptCheckBox_Changed(object sender, RoutedEventArgs e)
    {
        ContinueButton.IsEnabled = AcceptCheckBox.IsChecked == true;
    }

    private void BackButton_Click(object sender, RoutedEventArgs e)
    {
        AgreementPage.Visibility = Visibility.Collapsed;
        WelcomePage.Visibility = Visibility.Visible;
    }

    private void ContinueButton_Click(object sender, RoutedEventArgs e)
    {
        AgreementPage.Visibility = Visibility.Collapsed;
        ProgressPage.Visibility = Visibility.Visible;
        ProgressStatus.Text = "The installer UI is ready for the package workflow.";
    }

    private void CancelInstallButton_Click(object sender, RoutedEventArgs e) => Close();
}