import { tval } from '../../../../locale';

export const getSchemaApplyShowDetailModal = ({ styles }) => {
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
        'x-component': 'ViewApplyShowDetailAddBlock',
      },
    },
  };
};
