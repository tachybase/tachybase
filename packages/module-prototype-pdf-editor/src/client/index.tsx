import { Plugin } from '@tachybase/client';

import { PdfEditor } from './PdfEditor';

export class PluginPdfEditorClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('pdf-react', {
      title: 'Print template: react',
      icon: 'filepdfoutlined',
      Component: PdfEditor,
      sort: 200,
    });
  }
}

export default PluginPdfEditorClient;
