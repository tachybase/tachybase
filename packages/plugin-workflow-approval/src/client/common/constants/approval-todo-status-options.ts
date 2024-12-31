import { tval } from '../../locale';
import { APPROVAL_TODO_STATUS } from './approval-todo-status';

export const approvalTodoStatusOptions = [
  {
    value: APPROVAL_TODO_STATUS.ASSIGNED,
    label: tval('Assigned'),
    color: 'blue',
  },
  {
    value: APPROVAL_TODO_STATUS.PENDING,
    label: tval('Pending'),
    color: 'gold',
  },
  {
    value: APPROVAL_TODO_STATUS.RETURNED,
    label: tval('Returned'),
    color: 'purple',
  },
  {
    value: APPROVAL_TODO_STATUS.APPROVED,
    label: tval('Approved'),
    color: 'green',
  },
  {
    value: APPROVAL_TODO_STATUS.REJECTED,
    label: tval('Rejected'),
    color: 'red',
  },
  {
    value: APPROVAL_TODO_STATUS.WITHDRAWN,
    label: tval('Withdrawn'),
  },
];
export const approvalTodoStatusMap = approvalTodoStatusOptions.reduce(
  (configMap, option) => ({
    ...configMap,
    [option.value]: option,
  }),
  {},
);
