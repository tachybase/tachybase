import _ from 'lodash';

import { useResubmit } from '../../../approval-common/Resubmit.provider';

// 重新发起
export function useActionResubmit() {
  const { setResubmit } = useResubmit();

  return {
    async run() {
      setResubmit(true);
    },
  };
}
