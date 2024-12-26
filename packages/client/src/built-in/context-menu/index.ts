import { Plugin } from '../../application/Plugin';
import { ScrollAssistantStatusProvider } from '../scroll-assistant/ScrollAssistantStatus.provider';
import { ContextMenuProvider } from './ContextMenu.provider';
import { designerMode, disableRightMenu, fullScreen, hiddenScrollArea } from './ContextMenuItemsProps';

export { ContextMenuContext, useContextMenu } from './useContextMenu';
export type { ContextMenuContextProps } from './useContextMenu';

export class PluginContextMenu extends Plugin {
  async load() {
    // FIXME 需要 providers 支持排序
    this.app.use(ScrollAssistantStatusProvider);
    this.app.use(ContextMenuProvider);
    this.app.pluginContextMenu.add(designerMode.name, designerMode);
    this.app.pluginContextMenu.add(fullScreen.name, fullScreen);
    this.app.pluginContextMenu.add(disableRightMenu.name, disableRightMenu);
    this.app.pluginContextMenu.add(hiddenScrollArea.name, hiddenScrollArea);
  }
}
