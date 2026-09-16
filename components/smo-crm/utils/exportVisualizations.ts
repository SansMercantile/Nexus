import { toPng, toSvg } from 'html-to-image';

export type ExportImageFormat = 'png' | 'svg';

export interface ExportVisualizationsOptions {
  elementId: string;
  format: ExportImageFormat;
  filenamePrefix?: string;
  title?: string;
}

/**
 * Exports a DOM node (dashboard visualizations container) as a high-quality PNG or SVG.
 */
export async function exportDashboardVisualizations({
  elementId,
  format,
  filenamePrefix = 'SMO-Analytics-Visualizations',
}: ExportVisualizationsOptions): Promise<{ success: boolean; filename: string }> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Target visualizations container element '#${elementId}' was not found in the DOM.`);
  }

  const dateStamp = new Date().toISOString().split('T')[0];
  const filename = `${filenamePrefix}-${dateStamp}.${format}`;

  const filter = (node: HTMLElement) => {
    // Exclude no-print / non-presentation elements like action buttons or toasts if tagged
    if (node.classList && (
      node.classList.contains('no-export') ||
      node.getAttribute('data-no-export') === 'true'
    )) {
      return false;
    }
    return true;
  };

  let dataUrl: string;

  if (format === 'png') {
    dataUrl = await toPng(element, {
      quality: 0.98,
      pixelRatio: 2, // 2x high resolution for retina stakeholder slides
      backgroundColor: '#f8fafc',
      filter: filter as any,
      cacheBust: true,
    });
  } else {
    dataUrl = await toSvg(element, {
      quality: 0.98,
      backgroundColor: '#f8fafc',
      filter: filter as any,
      cacheBust: true,
    });
  }

  const link = document.createElement('a');
  link.download = filename;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  return { success: true, filename };
}
