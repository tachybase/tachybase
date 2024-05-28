import { Plugin } from '@tachybase/client';

import { tval } from '../../locale';
import { InternalPDFViewer } from './PDFViewer';
import {
  pdfViewActionInitializer,
  PDFViewerBlockInitializer,
  PDFViewerPrintActionInitializer,
  PDFViewerProvider,
  usePDFViewerPrintActionProps,
} from './PDFVIewerBlockInitializer';

export class PluginPDF extends Plugin {
  async load() {
    this.app.addScopes({
      usePDFViewerPrintActionProps,
    });
    this.app.addComponents({
      PDFViewerBlockInitializer,
      PDFViewerPrintActionInitializer,
      PDFViewerProvider,
      PDFViwer: InternalPDFViewer,
    });
    this.schemaInitializerManager.add(pdfViewActionInitializer);
    const previewBlockItem = {
      title: tval('preview block'),
      name: 'previewBlock',
      type: 'itemGroup',
      children: [],
    };
    this.app.schemaInitializerManager.get('popup:common:addBlock').add(previewBlockItem.name, previewBlockItem);
  }
}
