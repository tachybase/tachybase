import fs from 'fs';
import os from 'os';
import path from 'path';
import { Gateway } from '@tachybase/server';
import { uid } from '@tachybase/utils';

import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import _ from 'lodash';
import mime from 'mime-types';

import { FlowNodeModel, Instruction, JOB_STATUS, Processor } from '../..';

export interface Header {
  name: string;
  value: string;
}

export type RequestConfig = Pick<AxiosRequestConfig, 'url' | 'method' | 'params' | 'data' | 'timeout'> & {
  headers: Array<Header>;
  ignoreFail: boolean;
};
async function downloadToStream(resourceUrl, Headers, param, body) {
  try {
    // 发起 GET 请求，设置响应类型为流
    const response = await axios({
      method: 'GET',
      url: resourceUrl,
      headers: Headers,
      params: param,
      data: body,
      responseType: 'stream',
    });
    // 根据 MIME 类型获取文件扩展名
    const ext = mime.extension(Headers['Content-Type']);
    let tempFileName;
    do {
      tempFileName = `${uid()}.${ext}`;
    } while (fs.existsSync(tempFileName));

    const tempFilePath = path.join(os.tmpdir(), tempFileName);
    const writeStream = fs.createWriteStream(tempFilePath);
    // 将响应流写入临时文件
    response.data.pipe(writeStream);

    return new Promise((resolve, reject) => {
      writeStream.on('finish', () => {
        // 完成写入后，返回一个读取流
        resolve(fs.createReadStream(tempFilePath));
      });
      writeStream.on('error', (error) => {
        fs.unlinkSync(tempFilePath);
        reject(error);
      });
    });
  } catch (error) {
    console.error('下载文件时出错:', error);
    throw error;
  }
}

async function request(config, context) {
  // default headers
  const { token, origin } = context;
  const { method = 'POST', needAuthorization = true, data, timeout = 5000 } = config;

  const originUrl = config.url?.trim() || '';
  const url = originUrl.startsWith('http') ? originUrl : `${origin}${originUrl}`;

  let headers = (config.headers ?? []).reduce((result, header) => {
    return Object.assign(result, { [header.name]: header.value });
  }, {});
  const params = (config.params ?? []).reduce(
    (result, param) => Object.assign(result, { [param.name]: param.value }),
    {},
  );

  const requestParams: AxiosRequestConfig = {
    url,
    method,
    headers,
    params,
    data,
    timeout,
  };
  // let temp = context.get('headers');
  if (needAuthorization) {
    requestParams.headers = {
      Authorization: 'Bearer ' + token,
      ...headers,
    };
  }
  if (headers['Content-Type'] === 'multipart/form-data') {
    //workflow  contentType类型
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key === 'file') {
        let { url: resourceUrl, params: resourceParams, headers: resourceHeader, body: resourceBody } = data[key];
        resourceUrl = resourceUrl?.trim() || '';

        if (resourceHeader['Content-Type'] === 'multipart/form-data' && resourceBody) {
          //resource  contentType类型
          const formData = new FormData();
          Object.entries(resourceBody).forEach(([key, value]) => {
            formData.append(key, value);
          });

          config.data = formData;
        } else {
          config.data = resourceBody;
        }
        const stream = await downloadToStream(resourceUrl, resourceHeader, resourceParams, resourceBody);

        formData.append('file', stream);
        headers = { ...formData.getHeaders() };
      } else {
        formData.append(key, data[key]);
      }
    }
    requestParams.data = formData;
  } else {
    headers['Content-Type'] = 'application/json';
  }
  return axios.request(requestParams);
}

export default class extends Instruction {
  async run(node: FlowNodeModel, prevJob, processor: Processor) {
    const userId = _.get(processor.getScope(node.id), '$context.user.id', '');
    // TODO is not work with cluster
    const origin = Gateway.getInstance().runAtLoop;
    const token = this.workflow.app.authManager.jwt.sign({ userId });
    const context = { token, origin };

    const config = processor.getParsedValue(node.config, node.id) as RequestConfig;

    const { workflow } = processor.execution;
    const sync = this.workflow.isWorkflowSync(workflow);

    if (sync) {
      try {
        const response = await request(config, context);

        return {
          status: JOB_STATUS.RESOLVED,
          result: response.data,
        };
      } catch (error) {
        return {
          status: JOB_STATUS.FAILED,
          result: error.isAxiosError ? error.toJSON() : error.message,
        };
      }
    }

    const job = await processor.saveJob({
      status: JOB_STATUS.PENDING,
      nodeId: node.id,
      nodeKey: node.key,
      upstreamId: prevJob?.id ?? null,
    });

    // eslint-disable-next-line promise/catch-or-return
    request(config, context)
      .then((response) => {
        job.set({
          status: JOB_STATUS.RESOLVED,
          result: response.data,
        });
      })
      .catch((error) => {
        job.set({
          status: JOB_STATUS.FAILED,
          result: error.isAxiosError ? error.toJSON() : error.message,
        });
      })
      .finally(() => {
        processor.logger.info(`request (#${node.id}) response received, status: ${job.get('status')}`);
        this.workflow.resume(job);
      });

    processor.logger.info(`request (#${node.id}) sent to "${config.url}", waiting for response...`);

    return processor.exit();
  }

  async resume(node: FlowNodeModel, job, processor: Processor) {
    const { ignoreFail } = node.config as RequestConfig;
    if (ignoreFail) {
      job.set('status', JOB_STATUS.RESOLVED);
    }
    return job;
  }
}
