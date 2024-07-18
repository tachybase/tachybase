import actions from '@tachybase/actions';
import { Op } from '@tachybase/database';

import { COLLECTION_WORKFLOWS_NAME } from '../../common/constants';
import { APPROVAL_STATUS } from '../constants';

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

    // context.body = actions.list(context, next);

    // context.body
    // actions.list(context, next);
    // return
    // context.body = userJob;
  },
};
