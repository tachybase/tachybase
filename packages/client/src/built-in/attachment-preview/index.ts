import { Plugin } from '../../application/Plugin';
import { fileCSV, fileDef, filePdf, fileXLS, fileXLSX, imagejpeg, imagePng, imageSvg } from './previewers';

export class AttachmentPreviewPlugin extends Plugin {
  async load() {
    this.app.AttachmentPreviewManager.add(imagePng);
    this.app.AttachmentPreviewManager.add(imagejpeg);
    this.app.AttachmentPreviewManager.add(imageSvg);

    this.app.AttachmentPreviewManager.add(fileDef);
    this.app.AttachmentPreviewManager.add(filePdf);

    this.app.AttachmentPreviewManager.add(fileXLS);
    this.app.AttachmentPreviewManager.add(fileXLSX);
    this.app.AttachmentPreviewManager.add(fileCSV);
  }
}
