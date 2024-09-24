import { Plugin } from '../../application/Plugin';
import { fileDef, filePdf, imagejpeg, imagePng } from './AttachmentItems';

export class AttachmentPreviewPlugin extends Plugin {
  async load() {
    this.app.AttachmentPreviewManager.add(imagejpeg);
    this.app.AttachmentPreviewManager.add(fileDef);
    this.app.AttachmentPreviewManager.add(imagePng);
    this.app.AttachmentPreviewManager.add(filePdf);
  }
}
