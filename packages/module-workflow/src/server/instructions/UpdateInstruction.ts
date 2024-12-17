import fs from 'fs';
import { Readable } from 'stream';
import { parseCollectionName } from '@tachybase/data-source';
import { Gateway } from '@tachybase/server';
import { uid } from '@tachybase/utils';

import axios, { AxiosRequestConfig } from 'axios';
import FormData from 'form-data';
import _ from 'lodash';
import mime from 'mime-types';

import { Instruction } from '.';
import { JOB_STATUS } from '../constants';
import type Processor from '../Processor';
import type { FlowNodeModel } from '../types';

export class UpdateInstruction extends Instruction {
  async run(node: FlowNodeModel, input, processor: Processor) {
    const { collection, params = {} } = node.config;

    const [dataSourceName, collectionName] = parseCollectionName(collection);

    const { repository } = this.workflow.app.dataSourceManager.dataSources
      .get(dataSourceName)
      .collectionManager.getCollection(collectionName);
    const options = processor.getParsedValue(params, node.id);

    const c = this.workflow.app.dataSourceManager.dataSources
      .get(dataSourceName)
      .collectionManager.getCollection(collectionName);
    const fields = c.getFields();
    const fieldNames = Object.keys(params.values);
    const includesFields = fields.filter((field) => fieldNames.includes(field.options.name));

    const userId = _.get(processor.getScope(node.id), '$context.user.id', '');
    const token = this.workflow.app.authManager.jwt.sign({ userId });

    const isJSON = (str) => {
      try {
        return JSON.parse(str);
      } catch (e) {
        return false;
      }
    };
    //目前可处理url，json对象，base64
    const handleResource = async (resource) => {
      const parseRes = isJSON(resource);
      const config: AxiosRequestConfig<any> = {
        method: 'get',
        url: resource,
        responseType: 'stream',
      };
      const form = new FormData();
      if (resource.startsWith('data:')) {
        const matches = resource.match(/^data:(.+);base64,(.+)$/);
        if (matches) {
          const contentType = matches[1];
          const base64Data = matches[2];
          const buffer = Buffer.from(base64Data, 'base64');
          const ext = mime.extension(contentType);
          const filename = `${uid()}.${ext}`;

          form.append('file', buffer, {
            filename,
            contentType,
          });
        } else {
          throw new Error('Invalid data URL format');
        }
      } else if (parseRes) {
        const { url: resourceUrl, params: resourceParams, headers: resourceHeaders, body: resourceBody } = parseRes;
        config.url = resourceUrl;
        config.params = resourceParams;
        config.headers = resourceHeaders;
        if (resourceHeaders['content-type'] === 'multipart/form-data') {
          const formData = new FormData();
          Object.entries(resourceBody).forEach(([key, value]) => {
            formData.append(key, value);
          });
          config.data = formData;
        } else {
          config.data = resourceBody;
        }
        const response = await axios(config);
        const contentType = response.headers['content-type'];
        // 根据 MIME 类型获取文件扩展名
        const ext = mime.extension(contentType);
        const filename = `${uid()}.${ext}`;
        // 创建 FormData 实例
        form.append('file', response.data, {
          filename,
          contentType: response.headers['content-type'],
        });
      } else {
        // 下载指定 URL 的内容
        const response = await axios(config);
        // 获取文件的 MIME 类型
        const contentType = response.headers['content-type'];
        // 根据 MIME 类型获取文件扩展名
        const ext = mime.extension(contentType);
        const filename = `${uid()}.${ext}`;
        // 创建 FormData 实例
        form.append('file', response.data, {
          filename,
          contentType: response.headers['content-type'],
        });
      }
      // 发送 multipart 请求
      const origin = Gateway.getInstance().runAtLoop;
      const uploadResponse = await axios({
        method: 'post',
        url: origin + '/api/attachments:create',
        data: form,
        headers: {
          ...form.getHeaders(),
          Authorization: 'Bearer ' + token,
        },
      });
      return uploadResponse.data.data;
    };

    // 处理文件类型
    for (const attachmentField of includesFields) {
      if (attachmentField.options.interface === 'attachment') {
        const urls = options.values[attachmentField.options.name];
        if (Array.isArray(urls)) {
          for (const i in urls) {
            urls[i] = await handleResource(urls[i]);
          }
        } else {
          const url = options.values[attachmentField.options.name];
          options.values[attachmentField.options.name] = [await handleResource(url)];
        }
      }
    }

    const result = await repository.update({
      ...options,
      context: {
        stack: Array.from(new Set((processor.execution.context.stack ?? []).concat(processor.execution.id))),
      },
      transaction: this.workflow.useDataSourceTransaction(dataSourceName, processor.transaction),
    });

    return {
      result: result.length ?? result,
      status: JOB_STATUS.RESOLVED,
    };
  }
}

export default UpdateInstruction;
