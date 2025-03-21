import { Plugin } from '@tachybase/client';

import { NAMESPACE } from '../../constants';
import { i18nText } from '../locale';
import { AppManager } from './AppManager';

/** 系统配置部分 */
export class KitSystem extends Plugin {
  async load() {
    this.app.systemSettingsManager.add(`system-services.${NAMESPACE}`, {
      title: i18nText('Multi-app manager'),
      icon: 'AppstoreOutlined',
      Component: AppManager,
      aclSnippet: 'pm.multi-app.applications',
    });
  }
}
