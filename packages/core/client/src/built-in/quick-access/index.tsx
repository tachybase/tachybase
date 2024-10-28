import { Plugin } from '../../application/Plugin';
import { QuickAccessAction } from './Action';
import { QuickAccessBlock } from './Block';
import { quickAccessBlockInitializerItem } from './blockInitializerItem';
import { quickAccessBlockSettings } from './blockSettings';
import { quickAccessConfigureActions } from './configureActions';
import {
  quickAccessActionSettingsCustomRequest,
  QuickAccessCustomRequestActionSchemaInitializerItem,
} from './CustomRequestActionSchemaInitializerItem';
import { quickAccessActionSettingsLink } from './LinkActionSchemaInitializerItem';
import {
  quickAccessActionSettingsPopup,
  QuickAccessPopupActionSchemaInitializerItem,
} from './PopupActionSchemaInitializerItem';

export class QuickAccessPlugin extends Plugin {
  async load() {
    this.app.addComponents({ QuickAccessBlock, QuickAccessAction });
    this.app.schemaSettingsManager.add(quickAccessBlockSettings);
    this.app.schemaInitializerManager.add(quickAccessConfigureActions);

    // 添加到页面的 Add block 里
    this.app.schemaInitializerManager.addItem(
      'page:addBlock',
      `otherBlocks.${quickAccessBlockInitializerItem.name}`,
      quickAccessBlockInitializerItem,
    );
    // 添加到弹窗的 Add block 里
    this.app.schemaInitializerManager.addItem(
      'popup:common:addBlock',
      `otherBlocks.${quickAccessBlockInitializerItem.name}`,
      quickAccessBlockInitializerItem,
    );

    // link 操作
    this.app.schemaSettingsManager.add(quickAccessActionSettingsLink);

    // 打开弹窗
    this.app.schemaSettingsManager.add(quickAccessActionSettingsPopup);
    this.app.schemaInitializerManager.addItem('quickAccess:configureActions', `popup`, {
      Component: QuickAccessPopupActionSchemaInitializerItem,
    });
    // 自定义请求
    this.app.schemaSettingsManager.add(quickAccessActionSettingsCustomRequest);
    this.app.schemaInitializerManager.addItem('quickAccess:configureActions', `customRequest`, {
      Component: QuickAccessCustomRequestActionSchemaInitializerItem,
    });
  }
}
