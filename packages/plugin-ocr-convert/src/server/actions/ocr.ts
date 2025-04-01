import type { Context, Next } from '@tachybase/actions';

import { Jimp } from 'jimp';
import Tesseract from 'tesseract.js';

// 结构化数据的类型定义
interface OCRResult {
  project: string;
  area: string;
  content: string;
  person: string;
  time: string;
  comment: string;
}

/**
 * 解析 OCR 结果为 JSON 结构
 * @param text OCR 识别出的文本
 * @returns 解析后的 JSON 对象
 */
function parseText(text: string): OCRResult {
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const result: OCRResult = {};
  let lastKey: string | null = null;

  for (let line of lines) {
    const match = line.match(/^(.+?):\s*(.*)$/); // 匹配 "键: 值" 结构
    if (match) {
      lastKey = match[1].trim();
      result[lastKey] = match[2].trim();
    } else if (lastKey) {
      // 处理换行的值
      result[lastKey] += ' ' + line;
    }
  }

  return result;
}

/**
 * 识别图片左下角的文本并解析成 JSON
 * @param imagePath 图片路径
 * @returns 解析后的 JSON 结构
 */
async function extractStructuredText(imagePath: string): Promise<OCRResult> {
  const image = await Jimp.read(imagePath);
  const { width, height } = image.bitmap;

  // 裁剪左下角区域（假设高度占总图片的 20%，宽度占 30%）
  const croppedRegion = image.clone().crop(0, height * 0.8, width * 0.3, height * 0.2);
  await croppedRegion.writeAsync('cropped.png'); // 调试用

  // OCR 识别
  const {
    data: { text },
  } = await Tesseract.recognize(croppedRegion, 'eng+chi_sim', {
    logger: (m) => console.log(m),
  });

  // 解析文本并处理换行
  return parseText(text);
}

export const convertImage = async (ctx: Context, next: Next) => {
  const { url } = ctx.aciton.params;
  const json = await extractStructuredText(url);
  ctx.body = json;
  await next();
};
