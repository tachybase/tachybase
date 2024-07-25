import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';
import { Context } from '@tachybase/actions';
import { Model } from '@tachybase/database';

import Docxtemplater from 'docxtemplater';
// 导入 Docxtemplater 的 InspectModule 类
import InspectModule from 'docxtemplater/js/inspect-module';
import PizZip from 'pizzip';

export const generate = async (ctx: Context) => {
  const id = ctx.action.params.id;
  const repo = ctx.db.getRepository('templateManage');
  const template: Model = await repo.findOne({
    filter: {
      id,
    },
    appends: ['template'],
  });

  const rawTemplate = template.get();
  const templatePath = path.join(process.env.PWD, rawTemplate.template[0].get().url);
  const data = rawTemplate.testData;

  try {
    // 生成定制的 docx 文件
    const buffer = generateDocxFromTemplate(templatePath, data);
    ctx.withoutDataWrapping = true;
    ctx.body = buffer;
  } catch (error) {
    console.error('Error:', error);
    ctx.status = 500;
    ctx.body = 'Error generating files: ' + error.message;
  }
};

export const getTags = async (ctx: Context) => {
  const id = ctx.action.params.id;
  const repo = ctx.db.getRepository('templateManage');
  const template: Model = await repo.findOne({
    filter: {
      id,
    },
    appends: ['template'],
  });
  const rawTemplate = template.get();
  const templatePath = path.join(process.env.PWD, rawTemplate.template[0].get().url);

  try {
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const iModule = new InspectModule();
    const doc = new Docxtemplater(zip, { modules: [iModule] });

    // 获取所有占位符
    const allTags = iModule.getAllTags();

    // 将 tags 转换为 JSON 格式的字符串
    const tagsJson = JSON.stringify(allTags, null, 2);

    // 创建一个可读流
    const readableStream = new Readable({
      read(size) {
        this.push(tagsJson); // 将 tagsJson 写入流中
        this.push(null); // 结束流
      },
    });

    // 设置响应头和响应内容
    ctx.withoutDataWrapping = true;
    ctx.set('Content-Type', 'application/json');
    ctx.body = readableStream;
  } catch (error) {
    console.error('Error:', error);
    ctx.status = 500;
    ctx.body = 'Error generating tags: ' + error.message;
  }
};

function generateDocxFromTemplate(templatePath, data): Buffer {
  try {
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip);

    doc.setData(data);
    doc.render();

    return doc.getZip().generate({ type: 'nodebuffer' });
  } catch (error) {
    console.error('Error generating DOCX from template:', error);
    throw error;
  }
}
