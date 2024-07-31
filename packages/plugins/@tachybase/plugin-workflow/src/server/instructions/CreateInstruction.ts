import { parseCollectionName } from '@tachybase/data-source-manager';
import { Gateway } from '@tachybase/server';
import { uid } from '@tachybase/utils';

import axios from 'axios';
import FormData from 'form-data';
import _ from 'lodash';
import mime from 'mime-types';

import { Instruction } from '.';
import { JOB_STATUS } from '../constants';
import type Processor from '../Processor';
import type { FlowNodeModel } from '../types';
import { toJSON } from '../utils';

export class CreateInstruction extends Instruction {
  async run(node: FlowNodeModel, input, processor: Processor) {
    const { collection, params: { appends = [], ...params } = {} } = node.config;
    const [dataSourceName, collectionName] = parseCollectionName(collection);

    const { repository, filterTargetKey } = this.workflow.app.dataSourceManager.dataSources
      .get(dataSourceName)
      .collectionManager.getCollection(collectionName);
    const options = processor.getParsedValue(params, node.id);
    const transaction = this.workflow.useDataSourceTransaction(dataSourceName, processor.transaction);

    const c = this.workflow.app.dataSourceManager.dataSources
      .get(dataSourceName)
      .collectionManager.getCollection(collectionName);
    const fields = c.getFields();
    const fieldNames = Object.keys(params.values);
    const includesFields = fields.filter((field) => fieldNames.includes(field.options.name));

    const userId = _.get(processor.getScope(node.id), '$context.user.id', '');
    const token = this.workflow.app.authManager.jwt.sign({ userId });

    const handleUrl = async (url) => {
      const form = new FormData();
      if (url.startsWith('data:')) {
        const matches = url.match(/^data:(.+);base64,(.+)$/);
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
      } else {
        // 下载指定 URL 的内容
        const response = await axios({
          method: 'get',
          url,
          responseType: 'stream',
        });
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
            urls[i] = await handleUrl(urls[i]);
          }
        } else {
          const url = options.values[attachmentField.options.name];
          options.values[attachmentField.options.name] = await handleUrl(url);
        }
      }
    }

    const created = await repository.create({
      ...options,
      context: {
        stack: Array.from(new Set((processor.execution.context.stack ?? []).concat(processor.execution.id))),
      },
      transaction,
    });

    let result = created;
    if (created && appends.length) {
      const includeFields = appends.reduce((set, field) => {
        set.add(field.split('.')[0]);
        set.add(field);
        return set;
      }, new Set());
      result = await repository.findOne({
        filterByTk: created[filterTargetKey],
        appends: Array.from(includeFields),
        transaction,
      });
    }

    return {
      // NOTE: get() for non-proxied instance (#380)
      result: toJSON(result),
      status: JOB_STATUS.RESOLVED,
    };
  }
}

export default CreateInstruction;
