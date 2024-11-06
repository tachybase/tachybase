import { exec } from 'child_process';
import path from 'path';
import util from 'util';
import Database from '@tachybase/database';
import { Plugin } from '@tachybase/server';

import { Worker } from 'bullmq';

import { generate, getTags, readPDF } from './actions/printTemplates';
import { addConversionJob } from './actions/producer';

const execPromise = util.promisify(exec);

const redisOptions = {
  port: Number(process.env.REDIS_PORT || 6379),
  host: process.env.REDIS_HOST || 'localhost',
  password: process.env.REDIS_PASSWORD || '',
};

async function convertDocxToPdf(wordFilePath: string, outputDir: string, job: any, db: Database): Promise<string> {
  try {
    const fileName = path.basename(wordFilePath, '.docx') + '.pdf';
    const pdfFilePath = path.join(outputDir, fileName);

    console.log(`Converting ${wordFilePath} to PDF at ${pdfFilePath}`);
    const command = `libreoffice --headless --convert-to pdf --outdir "${outputDir}" "${wordFilePath}"`;
    console.log('commandcommandcommand:', command);

    // 更新进度到 20%：转换开始
    job.updateProgress(20);

    const { stdout, stderr } = await execPromise(command);
    console.log('stdout', stdout);
    console.log('stderr', stderr);

    // 更新进度到 80%：转换进行中
    job.updateProgress(80);

    console.log(`PDF created successfully: ${pdfFilePath}`);

    // 更新进度到 100%：转换完成
    job.updateProgress(100);

    db.getRepository('templateManage').update({
      filter: {
        id: job.data.id,
      },
      values: {
        pdf_SavePath: pdfFilePath,
      },
    });

    return pdfFilePath;
  } catch (error) {
    console.error('Error during conversion:', error);
    // 更新进度到 0% 或其他表示失败的值
    job.updateProgress(0);
    throw error;
  }
}

export class PluginPrintTemplateServer extends Plugin {
  async afterAdd() {}

  async beforeLoad() {}

  async load() {
    this.app.resourcer.define({
      name: 'printTemplates',
      actions: {
        generate,
        getTags,
        addConversionJob,
        readPDF,
      },
    });
    this.app.acl.allow('printTemplates', '*', 'public');

    this.app.use(require('koa-bodyparser')());

    const worker = new Worker(
      process.env.MSG_QUEUE_NAME || 'default',
      async (job) => {
        if (!job.data.wordFilePath || !job.data.outputDir) {
          console.error('Invalid job data:', job.data);
          throw new Error('Missing required job data properties');
        }

        const { wordFilePath, outputDir } = job.data;

        // 自动更新进度
        const pdfFilePath = await convertDocxToPdf(wordFilePath, outputDir, job, this.app.db);

        // 返回 PDF 文件路径
        return { pdfFilePath };
      },
      { connection: redisOptions },
    );

    worker.on('completed', (job, returnValue) => {
      console.log(`Job ${job.id} completed with result: ${JSON.stringify(returnValue)}`);
    });

    worker.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed with error: ${err.message}`);
    });
  }

  async beforeDestroy() {}
}

export default PluginPrintTemplateServer;
