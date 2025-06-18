import { JOB_STATUS } from '@tachybase/module-workflow/client';

import { NAMESPACE } from '../../locale';

export const jobStatusOptions = {
  [JOB_STATUS.PENDING]: {
    color: 'gold',
    label: `{{t('Pending', { ns: "${NAMESPACE}" })}}`,
  },
  [JOB_STATUS.RESOLVED]: {
    color: 'green',
    label: `{{t('Approved', { ns: "${NAMESPACE}" })}}`,
  },
  [JOB_STATUS.REJECTED]: {
    color: 'red',
    label: `{{t('Rejected', { ns: "${NAMESPACE}" })}}`,
  },
  [JOB_STATUS.RETRY_NEEDED]: {
    color: 'red',
    label: `{{t('Returned', { ns: "${NAMESPACE}" })}}`,
  },
};
