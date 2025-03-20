import { Plugin } from '@tachybase/client';

import { AppstoreOutlined } from '@ant-design/icons';

import { i18nText } from '../locale';
import { MultiAppBlockInitializer } from './MultiAppBlockInitializer';

/** 用户界面部分 */
export class KitUsage extends Plugin {
  async afterAdd() {}
  async load() {
    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');

    blockInitializers.add('otherBlocks.multiApp', {
      name: 'multiApp',
      title: i18nText('Multi-app manager'),
      icon: <AppstoreOutlined />,
      Component: MultiAppBlockInitializer,
    });
  }
}
