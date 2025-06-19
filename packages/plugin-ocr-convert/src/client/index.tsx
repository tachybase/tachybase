import React from 'react';
import { Plugin } from '@tachybase/client';

import { OcrProviders } from './OcrProviders';

import './locale';

import { NAMESPACE } from './locale';

export class PluginOcrConvertClient extends Plugin {
  async load() {
    this.app.systemSettingsManager.add('system-services.' + NAMESPACE, {
      icon: 'FileTextOutlined',
      title: `{{t("OCR Providers", { ns: "${NAMESPACE}" })}}`,
      Component: OcrProviders,
      aclSnippet: 'pm.ocr.providers',
    });
  }
}

export default PluginOcrConvertClient;
