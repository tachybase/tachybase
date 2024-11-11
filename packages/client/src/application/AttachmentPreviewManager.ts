import type { Application } from './Application';

export interface PluginAttachmentItemsOptions {
  key: string;
  type: string;
  viewComponet: (any) => JSX.Element;
  checkedComponent: (any) => JSX.Element;
}

export class AttachmentPreviewManager {
  protected attachmentItem: Record<string, PluginAttachmentItemsOptions> = {};
  public app: Application;

  constructor(_pluginAttachmentItems: Record<string, PluginAttachmentItemsOptions>, app: Application) {
    this.app = app;
    Object.entries(_pluginAttachmentItems || {}).forEach(([name, PluginItemsOptions]) => {
      this.add(PluginItemsOptions);
    });
  }

  get() {
    return this.attachmentItem;
  }

  getTypeItem(key) {
    return this.attachmentItem[key];
  }

  add(options: PluginAttachmentItemsOptions) {
    this.attachmentItem[options.key] = options;
  }
}
