import { useEffect } from 'react';
import { useFormBlockContext } from '@tachybase/client';

import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export function useApprovalDetailBlockProps() {
  const { snapshot } = useContextApprovalExecution();
  const { form } = useFormBlockContext();

  useEffect(() => {
    form.setValues(snapshot);
  }, [form, snapshot]);

  return { form };
}
