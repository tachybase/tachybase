import { Plugin } from '@tachybase/client';

import { AppstoreOutlined, WindowsOutlined } from '@ant-design/icons';

import { i18nText } from '../locale';
import { AppManager } from '../system/AppManager';
import { MultiAppBlockInitializer } from './MultiAppBlockInitializer';
import { ShowMultiAppBlockInitializer } from './ShowMultiAppBlockInitializer';
import { ViewMultiAppPane } from './ViewMultiAppPane';

/** 用户界面部分 */
export class KitUsage extends Plugin {
  async load() {
    this.app.addComponents({
      AppManager: AppManager,
      ViewMultiAppPane: ViewMultiAppPane,
    });
    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');

    // 添加多应用管理器
    blockInitializers.add('otherBlocks.multiApp', {
      name: 'multiApp',
      title: i18nText('Multi-app manager'),
      icon: <AppstoreOutlined />,
      Component: MultiAppBlockInitializer,
    });

    // 添加多应用展示器
    blockInitializers.add('otherBlocks.showMultiApp', {
      name: 'showMultiApp',
      title: i18nText('Multi-app display'),
      icon: <WindowsOutlined />,
      Component: ShowMultiAppBlockInitializer,
    });
  }
}
