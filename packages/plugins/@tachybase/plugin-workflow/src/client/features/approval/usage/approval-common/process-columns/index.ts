import { renderColumnDetail } from './render.detail';
import { renderColumnStatus } from './render.status';
import { renderColumnTaskNode } from './render.taskNode';

// 审批处理-表格行配置
export const getAntdTableColumns = ({ t, styles }) => {
  return [
    {
      title: t('Task node'),
      dataIndex: ['node', 'title'],
      onCell(taskNode) {
        return {
          rowSpan: taskNode.groupCount ?? 0,
        };
      },
      render: renderColumnTaskNode,
      width: 120,
    },
    {
      title: t('User'),
      dataIndex: ['user', 'nickname'],
      width: 120,
    },
    {
      title: t('Status', { ns: 'workflow' }),
      dataIndex: 'status',
      render: renderColumnStatus,
      width: 120,
    },
    {
      title: t('Details'),
      dataIndex: 'updatedAt',
      render: renderColumnDetail,
      width: 200,
      className: styles.columnDetail,
    },
  ];
};
