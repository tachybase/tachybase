import { tval } from '../../locale';
import { APPROVAL_INITIATION_STATUS } from './approval-initiation-status';

export const approvalStatusEnums = [
  {
    value: APPROVAL_INITIATION_STATUS.DRAFT,
    label: tval('Draft'),
    editable: true,
  },
  {
    value: APPROVAL_INITIATION_STATUS.RETURNED,
    label: tval('Returned'),
    color: 'purple',
    editable: true,
  },
  {
    value: APPROVAL_INITIATION_STATUS.SUBMITTED,
    label: tval('Submitted'),
    color: 'cyan',
  },
  {
    value: APPROVAL_INITIATION_STATUS.PROCESSING,
    label: tval('Processing'),
    color: 'gold',
  },
  {
    value: APPROVAL_INITIATION_STATUS.APPROVED,
    label: tval('Approved'),
    color: 'green',
  },
  {
    value: APPROVAL_INITIATION_STATUS.RESUBMIT,
    label: tval('Resubmit'),
    color: 'blue',
    editable: true,
  },
  {
    value: APPROVAL_INITIATION_STATUS.REJECTED,
    label: tval('Rejected'),
    color: 'red',
  },
  {
    value: APPROVAL_INITIATION_STATUS.ERROR,
    label: tval('ERROR'),
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
