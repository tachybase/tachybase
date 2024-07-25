import fs from 'fs'; //导入Node.js的文件系统模块，用于文件操作
import path from 'path'; //导入Node.js的路径模块，用于处理文件路径
import { Readable } from 'stream'; // 从'stream'模块导入Readable类，用于创建可读流
import { Context } from '@tachybase/actions'; //一个自定义库，用于处理请求上下文
import { Model } from '@tachybase/database'; //用于数据库操作的模型

import Docxtemplater from 'docxtemplater'; //用于处理word文版模板

// 导入 Docxtemplater 的 InspectModule 类
import InspectModule from 'docxtemplater/js/inspect-module'; //Docxtemplater使用它来处理Word文档。
import PizZip from 'pizzip'; //导入PizZip库，用于处理ZIP文件，Docxtemplater使用它来处理word文档

export const generate = async (ctx: Context) => {
  const id = ctx.action.params.id;
  const repo = ctx.db.getRepository('templateManage');
  const template: Model = await repo.findOne({
    filter: { id },
    appends: ['template'],
  });

  const rawTemplate = template.get();
  const templatePath = path.join(process.env.PWD, rawTemplate.template[0].get().url);
  const data = rawTemplate.testData;

  try {
    const buffer = generateDocxFromTemplate(templatePath, data);
    ctx.withoutDataWrapping = true;
    ctx.body = buffer;
    return buffer;
  } catch (error) {
    console.error('Error:', error);
    ctx.status = 500;
    ctx.body = 'Error generating files: ' + error.message;
    return { filePath: '' }; // 返回空路径以防止进一步的错误
  }
};

//用于获取文档中的所有占位符标签
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
    const content = fs.readFileSync(templatePath, 'binary'); //同步读取模板文件的内容
    const zip = new PizZip(content); //用读取的内容创建一个PizZip对象
    const iModule = new InspectModule(); //创建一个InspectModule实例
    const doc = new Docxtemplater(zip, { modules: [iModule] }); //使用PizZip对象和InspectModule创建一个Docxtemplater实例

    // 获取所有占位符
    const allTags = iModule.getAllTags(); //InspectModule获取文档中的所有标签
    console.log('All tags in the document:', allTags);

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

//用于生成word文档的二进制数据
function generateDocxFromTemplate(templatePath, data): Buffer {
  try {
    const content = fs.readFileSync(templatePath, 'binary');
    const zip = new PizZip(content);
    const doc = new Docxtemplater(zip); //Docxtemplater 是一个用于处理DOCX模板并填充数据的库。

    doc.setData(data);
    doc.render(); //渲染模板，将数据填充到模板的占位符中

    //调用 getZip 方法获取处理后的ZIP对象，然后调用 generate 方法生成DOCX文件的二进制数据。{ type: 'nodebuffer' } 选项指定输出类型为Node.js的Buffer。buffer是一个缓存区，用于存取二进制数据。
    return doc.getZip().generate({ type: 'nodebuffer' });
  } catch (error) {
    console.error('Error generating DOCX from template:', error);
    throw error;
  }
}
