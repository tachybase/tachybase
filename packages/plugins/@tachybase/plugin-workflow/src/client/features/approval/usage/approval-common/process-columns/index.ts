import { renderDetail } from './renderDetail';
import { renderStatus } from './renderStatus';
import { renderTaskNode } from './renderTaskNode';

// 审批处理-表格行配置
export const getAntdTableColumns = ({ t, styles }) => {
  return [
    {
      title: t('ID'),
      dataIndex: 'approvalId',
      width: 80,
    },
    {
      title: t('Task node'),
      dataIndex: ['node', 'title'],
      width: 120,
      onCell(taskNode) {
        return {
          rowSpan: taskNode.groupCount ?? 0,
        };
      },
      render: renderTaskNode,
    },
    {
      title: t('User'),
      dataIndex: ['user', 'nickname'],
      width: 100,
    },
    {
      title: t('Status', { ns: 'workflow' }),
      dataIndex: 'status',
      width: 100,
      render: renderStatus,
    },
    {
      title: t('Details'),
      dataIndex: 'updatedAt',
      width: 200,
      className: styles.columnDetail,
      render: renderDetail,
    },
  ];
};
