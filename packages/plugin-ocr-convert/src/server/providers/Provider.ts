import Plugin from '../plugin';

export interface OcrResult {
  text: string; // 识别的文字
  confidence?: number; // 置信度
  coordinates?: Array<{ x: number; y: number }>; // 坐标
  angle?: number; // 角度
  words?: Array<{ text: string; coordinates?: Array<{ x: number; y: number }> }>; // 单词
  [key: string]: any; // 其他属性
}

export class Provider {
  constructor(
    protected plugin: Plugin,
    protected options: any,
  ) {
    this.options = plugin.app.environment.renderJsonTemplate(options);
  }

  /**
   * 识别图片中的文字
   * @param imageData 图片数据，可以是URL或Base64编码的图片
   * @param type 识别类型
   * @param options 识别选项
   * @returns 识别结果
   */
  async recognize(imageData: string, type: string = 'general', options: any = {}): Promise<OcrResult[]> {
    throw new Error('Method not implemented');
  }

  /**
   * 检查是否为URL
   */
  protected isUrl(imageData: string): boolean {
    return imageData.startsWith('http://') || imageData.startsWith('https://');
  }

  /**
   * 检查是否为Base64编码的图片
   */
  protected isBase64Image(imageData: string): boolean {
    return (
      /^data:image\/(jpeg|png|jpg|gif|bmp);base64,/.test(imageData) ||
      /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(imageData)
    );
  }
}
