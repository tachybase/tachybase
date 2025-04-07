import path from 'path';
import { Plugin } from '@tachybase/server';
import { Registry } from '@tachybase/utils';

import { namespace, Provider } from './index';
import { initProviders } from './providers';

export class PluginOcrConvert extends Plugin {
  providers: Registry<typeof Provider> = new Registry();

  async install() {
    // const {
    //   DEFAULT_OCR_PROVIDER,
    //   TENCENT_CLOUD_SECRET_ID,
    //   TENCENT_CLOUD_SECRET_KEY,
    // } = process.env;
    // if (
    //   DEFAULT_OCR_PROVIDER &&
    //   TENCENT_CLOUD_SECRET_ID &&
    //   TENCENT_CLOUD_SECRET_KEY
    // ) {
    //   const ProviderRepo = this.db.getRepository('ocr_providers');
    //   const existed = await ProviderRepo.count({
    //     filterByTk: DEFAULT_OCR_PROVIDER,
    //   });
    //   if (existed) {
    //     return;
    //   }
    //   await ProviderRepo.create({
    //     values: {
    //       id: DEFAULT_OCR_PROVIDER,
    //       type: 'tencent-cloud',
    //       title: 'Default Tencent Cloud OCR Provider',
    //       options: {
    //         secretId: TENCENT_CLOUD_SECRET_ID,
    //         secretKey: TENCENT_CLOUD_SECRET_KEY,
    //       },
    //       default: true,
    //     },
    //   });
    // }
  }

  async load() {
    const { app, db } = this;

    // 初始化提供商
    await initProviders(this);

    // 设置权限
    app.acl.allow('ocr_records', 'create', 'loggedIn');
    app.acl.allow('ocr_records', 'list', 'loggedIn');
    app.acl.allow('ocr_records', 'get', 'loggedIn');

    this.app.acl.registerSnippet({
      name: `pm.ocr.providers`,
      actions: ['ocr_providers:*', 'ocr:*'],
    });
  }

  async getDefault() {
    const providerRepo = this.db.getRepository('ocr_providers');
    return providerRepo.findOne({
      filter: {
        default: true,
      },
    });
  }
}

export default PluginOcrConvert;
