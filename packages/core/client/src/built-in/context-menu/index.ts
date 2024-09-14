import { Plugin } from '../../application/Plugin';
import { ContextMenuProvider } from './ContextMenu.provider';
import { designerMode, disableRightMenu, dragAssistant, fullScreen } from './ContextMenuItemsProps';

export * from './useContextMenu';

export class PluginContextMenu extends Plugin {
  async load() {
    this.app.use(ContextMenuProvider);
    this.app.pluginContextMenu.add(dragAssistant.name, dragAssistant);
    this.app.pluginContextMenu.add(designerMode.name, designerMode);
    this.app.pluginContextMenu.add(fullScreen.name, fullScreen);
    this.app.pluginContextMenu.add(disableRightMenu.name, disableRightMenu);
  }
}
