import WorkflowPlugin from '@tachybase/plugin-workflow';
import { Plugin } from '@tachybase/server';
import path from 'path';
import { NOTICE_INSTRUCTION_NAMESPACE } from '../common/constants';
import NoticeInstruction from './NoticeInstruction';
import { init } from './actions';
import { COLLECTION_WORKFLOWS_NAME } from './collections/workflowNotice';
import { COLLECTION_NOTICE_NAME } from '../common/constants';

export class PluginWorkflowNoticeServer extends Plugin {
  workflow;
  async afterAdd() {}

  async beforeLoad() {
    this.app.on('afterLoadPlugin', (plugin) => {
      if (!(plugin instanceof WorkflowPlugin)) {
        return;
      }
      this.workflow = plugin;
      plugin.instructions.register(NOTICE_INSTRUCTION_NAMESPACE, new NoticeInstruction(plugin));
    });
  }

  async load() {
    const { db } = this;
    db.addMigrations({
      namespace: NOTICE_INSTRUCTION_NAMESPACE,
      directory: path.resolve(__dirname, 'migrations'),
      context: {
        plugin: this,
      },
    });
    await db.import({
      directory: path.resolve(__dirname, 'collections'),
    });

    init(this);

    this.app.acl.allow(COLLECTION_WORKFLOWS_NAME, ['listWorkflowNoticeFlows'], 'loggedIn');
    this.app.acl.allow(COLLECTION_NOTICE_NAME, ['get', 'list', 'listCentralized', 'submit'], 'loggedIn');
  }

  async install() {}
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}

export default PluginWorkflowNoticeServer;
