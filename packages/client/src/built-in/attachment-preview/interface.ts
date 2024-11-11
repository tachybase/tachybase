export interface AttachmentPreviewParams {
  key?: string;
  file?: Record<string, any>;
  bestImageInfo?: Record<string, any>;
  /** MIME 类型 */
  mimetype?: string;
  prefixCls?: string;
  onDoubleClick?: Function;
  onWheel?: Function;
  onDragStart?: Function;
}
