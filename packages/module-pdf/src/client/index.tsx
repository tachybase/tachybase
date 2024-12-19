import { Plugin } from '@tachybase/client';

import { PDFService } from './PDFService';

export { PDFPreview } from './PDFPreview';
export class ModulePdfClient extends Plugin {
  async afterAdd() {
    this.pm.add(PDFService);
  }
}
export default ModulePdfClient;
