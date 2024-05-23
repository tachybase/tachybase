import { Plugin } from '@tachybase/client';
import { ApprovalBlockInitializer } from './ApprovalBlockInitializer';
import { ApprovalSettings } from './ApprovalSettings';
import { TodosBlock } from './todos/TodosBlock';
import { InitiationsBlock } from './initiations/InitiationsBlock';
import { LauncherActionConfigInitializer } from './initiations/config/LauncherActionConfig';
import { ViewActionTodosContent } from './todos/component/ViewActionTodosContent';
import { ViewActionUserInitiationsContent } from './initiations/component/ViewActionUserInitiationsContent';
import { ApprovalProcess } from './component/ApprovalProcess.view';
import { ViewActionInitiationsContent } from './initiations/component/ViewActionInitiationsContent';

class PluginApproval extends Plugin {
  async load() {
    this.app.addComponents({
      ApprovalBlockInitializer,
      InitiationsBlock,
      TodosBlock,
      ViewActionTodosContent,
      ViewActionUserInitiationsContent,
      ViewActionInitiationsContent,
      'ApprovalCommon.ViewComponent.MApprovalProcess': ApprovalProcess,
    });
    this.app.schemaSettingsManager.add(ApprovalSettings);
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', 'otherBlocks.approval', {
      title: 'Approval',
      name: 'approval',
      type: 'item',
      Component: 'ApprovalBlockInitializer',
    });
    this.app.schemaInitializerManager.add(LauncherActionConfigInitializer);
  }
}

export default PluginApproval;
