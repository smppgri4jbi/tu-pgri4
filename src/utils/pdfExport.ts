import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';

export interface PdfExportOptions {
  filename?: string;
  watermark?: string;
  forceSinglePage?: boolean;
  fitToSinglePage?: boolean;
  onProgress?: (status: string) => void;
}

/**
 * High-resolution PDF exporter using html-to-image & jsPDF.
 * Uses native browser rasterization to fully support Tailwind CSS v4 OKLCH color functions.
 * Guarantees that the signature, stamp, and footer sections are never clipped.
 */
export async function exportElementToPdf(
  elementIdOrElement: string | HTMLElement,
  options: PdfExportOptions = {}
): Promise<boolean> {
  const { filename = 'Dokumen_Surat_Sekolah.pdf', onProgress } = options;

  try {
    if (onProgress) onProgress('Menyiapkan tata letak dokumen A4...');

    const targetElement = typeof elementIdOrElement === 'string'
      ? document.getElementById(elementIdOrElement)
      : elementIdOrElement;

    if (!targetElement) {
      console.error(`Target element not found: ${elementIdOrElement}`);
      return false;
    }

    if (onProgress) onProgress('Merender grafis dokumen & stempel...');

    const target = targetElement as HTMLElement;
    // Capture full scrollable dimensions to prevent any clipping of bottom signature
    const targetWidth = target.scrollWidth || target.offsetWidth;
    const targetHeight = Math.max(target.scrollHeight, target.offsetHeight);

    // toPng handles Tailwind v4 oklch() color syntax natively via browser rendering engine.
    // skipFonts: true prevents html-to-image from accessing cross-origin CSSStyleSheet.cssRules
    const dataUrl = await toPng(target, {
      quality: 0.98,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      width: targetWidth,
      height: targetHeight,
      skipFonts: true,
      fontEmbedCSS: '',
      cacheBust: false,
      filter: (node) => {
        if (node instanceof HTMLElement && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      }
    });

    if (onProgress) onProgress('Menyusun lembar PDF standar kedinasan...');

    // Determine actual rendered image dimensions
    const img = new Image();
    img.src = dataUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = () => reject(new Error('Gagal memuat gambar render'));
    });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210; // A4 width in mm
    const pdfHeight = 297; // A4 height in mm

    // Safe printable margins (7mm for guaranteed printer feed and zero cutoffs)
    const margin = 7;
    const maxAvailableWidth = pdfWidth - (margin * 2); // 196mm
    const maxAvailableHeight = pdfHeight - (margin * 2); // 283mm

    const imgWidth = img.width;
    const imgHeight = img.height;

    // School letters are strictly 1-page official documents unless explicitly disabled
    const forceSinglePage = options.forceSinglePage ?? (options.fitToSinglePage ?? true);
    const isMultiPageDocument = !forceSinglePage && ((imgHeight / imgWidth) > 1.85);

    if (!isMultiPageDocument) {
      // Single page document: Scale proportionally so that the entire letter,
      // including bottom signature, stamp, QR verification badge, and footer,
      // fits 100% comfortably inside A4 boundaries with safe margins.
      const scaleFactor = Math.min(
        maxAvailableWidth / imgWidth,
        maxAvailableHeight / imgHeight
      );

      const renderWidth = imgWidth * scaleFactor;
      const renderHeight = imgHeight * scaleFactor;

      // Center horizontally and vertically within the A4 sheet
      const posX = (pdfWidth - renderWidth) / 2;
      const posY = (pdfHeight - renderHeight) / 2;

      pdf.addImage(dataUrl, 'PNG', posX, posY, renderWidth, renderHeight, undefined, 'FAST');
    } else {
      // Multi-page document handling (for extensive logs or tabular reports)
      const renderWidth = maxAvailableWidth;
      const renderHeight = (imgHeight * maxAvailableWidth) / imgWidth;
      let heightLeft = renderHeight;
      let position = margin;

      pdf.addImage(dataUrl, 'PNG', margin, position, renderWidth, renderHeight, undefined, 'FAST');
      heightLeft -= maxAvailableHeight;

      while (heightLeft > 0) {
        position -= maxAvailableHeight;
        pdf.addPage();
        pdf.addImage(dataUrl, 'PNG', margin, position, renderWidth, renderHeight, undefined, 'FAST');
        heightLeft -= maxAvailableHeight;
      }
    }

    if (onProgress) onProgress('Mengunduh file PDF ke perangkat...');
    pdf.save(filename.endsWith('.pdf') ? filename : `${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Failed to export PDF via toPng:', error);
    triggerPrintFallback();
    return false;
  }
}

/**
 * Resilient print trigger
 */
export function triggerPrintFallback(): void {
  try {
    window.print();
  } catch (err) {
    console.warn('window.print() error:', err);
  }
}
