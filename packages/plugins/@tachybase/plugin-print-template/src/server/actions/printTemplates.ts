import fs from 'fs';
import path from 'path';
import { PassThrough, Readable } from 'stream';
import { Context } from '@tachybase/actions';
import { Model } from '@tachybase/database';

import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

import { getTemplateParams } from './template-params'; // 导入 getTemplateParams

export const generate = async (ctx: Context) => {
  const id = ctx.action.params.id;
  const repo = ctx.db.getRepository('templateManage');
  const template: Model = await repo.findOne({
    filter: {
      id,
    },
    appends: ['template'],
  });
  console.log(template.get());

  const rawTemplate = template.get();
  const templatePath = path.join(process.env.PWD, rawTemplate.template[0].get().url);

  const data = rawTemplate.testData;

  const outputPath = path.join(__dirname, './output.docx');

  try {
    // 获取模板中的占位符
    const tags = (await getTemplateParams(templatePath)) as any;
    console.log('Template tags:', tags);

    // 验证数据是否包含所有占位符
    const missingTags = tags.filter((tag) => !data.prototype.hasOwnProperty.call(tag.replace(/[{}]/g, '')));
    if (missingTags.length > 0) {
      // throw new Error(`Missing data for tags: ${missingTags.join(',')}`);
      console.log('Missing data for tags');
    }

    // 生成定制的 docx 文件
    const buffer = generateDocxFromTemplate(templatePath, data);

    // 创建一个可读流
    const readableStream = new Readable({
      read(size) {
        // 将Buffer数据push到可读流中
        this.push(buffer);
        // 标记流的末尾
        this.push(null);
      },
    });

    ctx.withoutDataWrapping = true;
    // 设置响应类型为二进制流
    ctx.set('Content-Type', 'application/octet-stream');
    // 将可读流设置为响应体
    ctx.body = readableStream;

    // // 确保生成的 docx 文件存在
    // if (!fs.existsSync(outputPath)) {
    //     throw new Error('Generated DOCX file not found');
    // }
    // ctx.body = 'Word and PDF files generated';
  } catch (error) {
    console.error('Error:', error);
    ctx.status = 500;
    ctx.body = 'Error generating files: ' + error.message;
  }
};

function generateDocxFromTemplate(templatePath, data): Buffer {
  try {
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    doc.setData(data);

    try {
      doc.render();
    } catch (error) {
      console.error('Error rendering template:', error);
      throw error;
    }

    return doc.getZip().generate({ type: 'nodebuffer' });
  } catch (error) {
    console.error('Error generating DOCX from template:', error);
    throw error; // Ensure errors are propagated correctly
  }
}
