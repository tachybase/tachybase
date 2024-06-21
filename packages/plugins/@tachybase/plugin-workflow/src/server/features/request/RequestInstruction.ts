import { Gateway } from '@tachybase/server';

import axios, { AxiosRequestConfig } from 'axios';
import _ from 'lodash';

import { FlowNodeModel, Instruction, JOB_STATUS, Processor } from '../..';

export interface Header {
  name: string;
  value: string;
}

export type RequestConfig = Pick<AxiosRequestConfig, 'url' | 'method' | 'params' | 'data' | 'timeout'> & {
  headers: Array<Header>;
  ignoreFail: boolean;
};

async function request(config, context) {
  // default headers
  const { token, origin } = context;
  const { url: originUrl, method = 'POST', data, timeout = 5000 } = config;

  const url = originUrl.startsWith('http') ? originUrl : `${origin}${originUrl}`;

  let headers = (config.headers ?? []).reduce((result, header) => {
    if (header.name.toLowerCase() === 'content-type') {
      return result;
    }
    return Object.assign(result, { [header.name]: header.value });
  }, {});
  const params = (config.params ?? []).reduce(
    (result, param) => Object.assign(result, { [param.name]: param.value }),
    {},
  );

  // TODO(feat): only support JSON type for now, should support others in future
  headers['Content-Type'] = 'application/json';

  // let temp = context.get('headers');
  headers = {
    Authorization: 'Bearer ' + token,
    ...headers,
  };
  return axios.request({
    url,
    method,
    headers,
    params,
    data,
    timeout,
  });
}

export default class extends Instruction {
  async run(node: FlowNodeModel, prevJob, processor: Processor) {
    const userId = _.get(processor.getScope(node.id), '$context.user.id', '');
    // TODO is not work with cluster
    const origin = Gateway.getInstance().runAtLoop;
    const token = this.workflow.app.authManager.jwt.sign({ userId });
    const context = { token, origin };

    const config = processor.getParsedValue(node.config, node.id) as RequestConfig;
    // delete user token if outer http
    if (config.url?.startsWith('http')) {
      delete context.token;
      delete context.origin;
    }
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
