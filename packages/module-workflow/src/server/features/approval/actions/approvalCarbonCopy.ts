import actions from '@tachybase/actions';
import { Op } from '@tachybase/database';

import { COLLECTION_WORKFLOWS_NAME } from '../../common/constants';
import { APPROVAL_STATUS } from '../constants/status';
import { searchSummaryQuery } from '../tools';
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

    /**
     * 以下为摘要搜索逻辑, 由于 summary 在不同的 workflow 中可能有不同的结构,
     * 因此在构造查询条件反而比较麻烦, 因此不分页, 直接在返回结果里筛选.
     * XXX: 大量数据时,怎么办
     */
    const summaryQueryValue = context.action?.params.summaryQueryValue;
    if (summaryQueryValue) {
      await searchSummaryQuery(context, next, summaryQueryValue);

      if (context.body) {
        context.body = findUniqueObjects(
          context.body,
          ['userId', 'approvalId'],
          'createdAt',
          (a: string, b: string) => new Date(a).getTime() - new Date(b).getTime(),
        );
      }

      return;
    }
    /** 以上为摘要搜索逻辑 */

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
