import { tval } from '../../../../locale';

export const getSchemaApplyShowDetailWrapper = ({ styles }) => {
  return {
    name: 'drawer',
    type: 'void',
    title: tval("Approver's interface"),
    'x-component': 'Action.Drawer',
    'x-component-props': {
      className: styles.container,
    },
    properties: {
      applyDetail: {
        type: 'string',
        'x-component': 'ApproverBlock',
      },
    },
  };
};
