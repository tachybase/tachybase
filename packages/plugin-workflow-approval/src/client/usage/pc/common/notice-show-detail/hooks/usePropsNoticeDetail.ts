import { useEffect } from 'react';
import { useFormBlockContext } from '@tachybase/client';

import { useContexWorkflowNotice } from '../contexts/WorkflowNotice.context';

export function usePropsNoticeDetail() {
  const { snapshot } = useContexWorkflowNotice();
  const { form } = useFormBlockContext();

  useEffect(() => {
    form.setValues(snapshot);
  }, [form, snapshot]);

  return { form };
}
