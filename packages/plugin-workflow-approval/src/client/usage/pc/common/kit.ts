import { Plugin } from '@tachybase/client';

import { ApprovalLastNodeColumn } from './approval-columns/lastNode.column';
import { ApprovalsSummary } from './approval-columns/summary.column';
import { ApprovalDataProvider } from './ApprovalData.provider';
import { ApprovalProcess } from './ApprovalProcess.view';
import { ApprovalProcessTimeLine } from './ApprovalProcessTimeLine.view';

export class KitApprovalCommon extends Plugin {
  async load() {
    this.app.addComponents({
      'ApprovalCommon.Provider.ApprovalDataProvider': ApprovalDataProvider,
      'ApprovalCommon.ViewComponent.ApprovalProcess': ApprovalProcess,
      'ApprovalCommon.ViewComponent.ApprovalProcessTimeLine': ApprovalProcessTimeLine,
      ApprovalsSummary: ApprovalsSummary,
      ApprovalLastNodeColumn: ApprovalLastNodeColumn,
    });
  }
}
