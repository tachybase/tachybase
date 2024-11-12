import path from 'path';
import { Plugin } from '@tachybase/server';

import { PluginWorkflow } from '../..';
import { COLLECTION_NOTICE_NAME, NOTICE_INSTRUCTION_NAMESPACE } from '../common/constants';
import { init } from './actions';
import { COLLECTION_WORKFLOWS_NAME } from './collections/workflowNotice';
import NoticeInstruction from './NoticeInstruction';

export class PluginWorkflowNoticeServer extends Plugin {
  workflow;
  async afterAdd() {}

  async beforeLoad() {
    this.app.on('afterLoadPlugin', (plugin) => {
      if (!(plugin instanceof PluginWorkflow)) {
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
