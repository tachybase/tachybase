import actions from '@tachybase/actions';
import { Op } from '@tachybase/database';
import { COLLECTION_WORKFLOWS_NAME } from '@tachybase/module-workflow';

import { APPROVAL_STATUS } from '../constants/status';
import { findUniqueObjects } from '../utils';

export const approvalCarbonCopy = {
  async listCentralized(context, next) {
    const centralizedApprovalFlow = await context.db.getRepository(COLLECTION_WORKFLOWS_NAME).find({
      filter: {
        type: 'approval',
        'config.centralized': true,
      },
      fields: ['id'],
    });
    context.action.mergeParams({
      filter: {
        workflowId: centralizedApprovalFlow.map((item) => item.id),
        approval: {
          status: {
            [Op.ne]: APPROVAL_STATUS.DRAFT,
          },
        },
      },
    });

    await actions.list(context, next);

    // NOTE: 进一步筛选, 筛选出同个用户下相同的approvalid, 只保留最新的一份.
    if (context.body.rows) {
      context.body.rows = findUniqueObjects(
        context.body.rows,
        ['userId', 'approvalId'],
        'createdAt',
        (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(),
      );
    }
  },
};
