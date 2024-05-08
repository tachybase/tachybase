import { Plugin } from '@tachybase/client';
import {
  PDFViewerBlockInitializer,
  PDFViewerPrintActionInitializer,
  PDFViewerProvider,
  pdfViewActionInitializer,
  usePDFViewerPrintActionProps,
} from '../../schema-initializer';
import { InternalPDFViewer } from '../../schema-components';
import { tval } from '../../locale';

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
    // 预览区块需要提前加进来，没法放在 afterload 中，这块后面需要重构
    const previewBlockItem = {
      title: tval('preview block'),
      name: 'previewBlock',
      type: 'itemGroup',
      children: [],
    };
    this.app.schemaInitializerManager.get('popup:common:addBlock').add(previewBlockItem.name, previewBlockItem);
  }
}
