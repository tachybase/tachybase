import { Plugin } from '@tachybase/client';
import { ArrayItems } from '@tachybase/components';

import { PluginWorkflow } from '../../../Plugin';
import { NOTICE_INSTRUCTION_NAMESPACE } from '../../common/constants';
import { NoticeInstruction } from './Notice.instruction';
import { SCNoticeDetail } from './show-interface/NoticeDetail.schema';

export class KitConfiguration extends Plugin {
  async afterAdd() {
    await this.app.pm.add(SCNoticeDetail);
  }

  async load() {
    const pluginWorkflow = this.app.pm.get(PluginWorkflow);
    pluginWorkflow.registerInstruction(NOTICE_INSTRUCTION_NAMESPACE, NoticeInstruction);
    this.app.addComponents({
      ArrayItems,
    });
  }
}
