import fs from 'fs';
import os from 'os';
import path from 'path';
import { Context } from '@tachybase/actions';

import { Queue } from 'bullmq';

import { generate } from './printTemplates';

// 用于将 Buffer 保存为临时文件并返回文件路径
function saveBufferToTempFile(buffer: Buffer): string {
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, `document-${Date.now()}.docx`);
  fs.writeFileSync(tempFilePath, buffer);
  return tempFilePath;
}

// 创建队列
const redisOptions = {
  port: Number(process.env.REDIS_PORT || 6379),
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || '',
  // 移除 tls 属性
};

const pdfConversionQueue = new Queue('default', { connection: redisOptions });

export const addConversionJob = async (ctx: Context) => {
  try {
    if (!ctx.action || !ctx.action.params) {
      throw new Error('Missing action or action params in context');
    }

    // 生成文件路径并添加到队列
    const result = await generate(ctx);

    // 检查 result 类型
    let filePath: string;
    if (Buffer.isBuffer(result)) {
      filePath = saveBufferToTempFile(result);
    } else if (result && typeof result === 'object' && 'filePath' in result) {
      filePath = (result as { filePath: string }).filePath;
    } else {
      throw new Error('Invalid result from generate function');
    }

    console.log('Generated DOCX file path:', filePath);

    const id = ctx.action.params.id;
    const outputDir = path.join(process.env.PWD, 'storage/uploads');

    // 添加作业到队列
    const job = await pdfConversionQueue.add('convert', { wordFilePath: filePath, outputDir, id });

    // 返回作业 ID 和 PDF 文件路径
    ctx.body = { jobId: job.id };
  } catch (error) {
    console.error('Error adding conversion job:', error);
    ctx.status = 500;
    ctx.body = 'Error adding conversion job: ' + error.message;
  }
};

export default addConversionJob;
