import { Plugin } from '@tachybase/client';
import { ApprovalBlockInitializer } from './ApprovalBlockInitializer';
import { ApprovalSettings } from './ApprovalSettings';
import { TodosBlock } from './TodosBlock';
import { InitiationsBlock } from './InitiationsBlock';

class PluginApproval extends Plugin {
  async load() {
    this.app.addComponents({
      ApprovalBlockInitializer,
      InitiationsBlock,
      TodosBlock,
    });
    this.app.schemaSettingsManager.add(ApprovalSettings);
    this.app.schemaInitializerManager.addItem('mobilePage:addBlock', 'otherBlocks.approval', {
      title: 'Approval',
      name: 'approval',
      type: 'item',
      Component: 'ApprovalBlockInitializer',
    });
  }
}

export default PluginApproval;
