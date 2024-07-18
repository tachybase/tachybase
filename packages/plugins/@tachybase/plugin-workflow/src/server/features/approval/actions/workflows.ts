import actions from '@tachybase/actions';

export const workflows = {
  async listApprovalFlows(context, next) {
    context.action.mergeParams({
      filter: {
        type: 'approval',
        enabled: true,
        // TODO: 仅显示当前用户有权限的流程
      },
    });
    return actions.list(context, next);
  },
};
