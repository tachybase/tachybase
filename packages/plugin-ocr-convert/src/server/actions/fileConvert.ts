import fs from 'fs';
import { promisify } from 'util';
import { Context, Next } from '@tachybase/actions';

import axios from 'axios';
import Docxtemplater from 'docxtemplater';
import ExcelJS from 'exceljs';
import PizZip from 'pizzip';

// 判断是否为URL
function isUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
}

// 获取模板内容，支持本地文件路径和远程URL
async function getTemplateContent(template: string): Promise<Buffer> {
  if (isUrl(template)) {
    // 如果是URL，下载文件
    const response = await axios.get(template, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  } else {
    // 如果是本地文件路径，直接读取
    return await promisify(fs.readFile)(template);
  }
}

// 将模板文本转成word
export async function convertToWord(context: Context, next: Next) {
  const { values } = context.action.params;
  const { template, data, saveType, fileName } = values;

  try {
    // 获取模板内容，支持本地文件和远程URL
    const templateContent = await getTemplateContent(template);

    const zip = new PizZip(templateContent);
    const doc = new Docxtemplater(zip);
    doc.render(data);
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });

    // 判断保存方式是通过文件还是通过流
    if (saveType === 'file') {
      fs.writeFileSync(fileName, buffer);
    } else {
      context.body = buffer;
    }
  } catch (error) {
    context.status = 500;
    context.body = {
      success: false,
      message: `转换Word文档失败: ${error.message}`,
    };
  }
}

// 将模板文本转成excel
export async function convertToExcel(context: Context, next: Next) {
  const { values } = context.action.params;
  const { template, data, saveType, fileName } = values;

  try {
    const workbook = new ExcelJS.Workbook();

    // 检查模板是本地文件还是远程URL
    if (isUrl(template)) {
      // 如果是URL，使用流方式加载
      const response = await axios.get(template, { responseType: 'arraybuffer' });
      await workbook.xlsx.load(response.data);
    } else {
      // 如果是本地文件路径，直接读取
      await workbook.xlsx.readFile(template);
    }

    const worksheet = workbook.getWorksheet(1); // 选择第一个工作表
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        if (typeof cell.value === 'string') {
          cell.value = cell.value.replace(/{([\u4e00-\u9fa5_a-zA-Z0-9]+)}/g, (_, key) => data[key] || cell.value);
        }
      });
    });

    // 判断保存方式是通过文件还是通过流
    if (saveType === 'file') {
      await workbook.xlsx.writeFile(fileName);
    } else {
      context.body = await workbook.xlsx.writeBuffer();
    }
  } catch (error) {
    context.status = 500;
    context.body = {
      success: false,
      message: `转换Excel文档失败: ${error.message}`,
    };
  }
}
