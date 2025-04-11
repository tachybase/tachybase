import { APPROVAL_INITIATION_STATUS } from './approval-initiation-status';

export const approvalStatusEnums = [
  {
    value: APPROVAL_INITIATION_STATUS.DRAFT,
    label: 'Draft',
    editable: true,
  },
  {
    value: APPROVAL_INITIATION_STATUS.RETURNED,
    label: 'Returned',
    color: 'purple',
    editable: true,
  },
  {
    value: APPROVAL_INITIATION_STATUS.SUBMITTED,
    label: 'Submitted',
    color: 'cyan',
  },
  {
    value: APPROVAL_INITIATION_STATUS.PROCESSING,
    label: 'Processing',
    color: 'gold',
  },
  {
    value: APPROVAL_INITIATION_STATUS.APPROVED,
    label: 'Approved',
    color: 'green',
  },
  {
    value: APPROVAL_INITIATION_STATUS.RESUBMIT,
    label: 'Resubmit',
    color: 'blue',
    editable: true,
  },
  {
    value: APPROVAL_INITIATION_STATUS.REJECTED,
    label: 'Rejected',
    color: 'red',
  },
  {
    value: APPROVAL_INITIATION_STATUS.ERROR,
    label: 'ERROR',
    color: '#FF0000',
  },
];

export const approvalInitiationStatusMap = approvalStatusEnums.reduce(
  (configMap, options) => ({
    ...configMap,
    [options.value]: options,
  }),
  {},
);
