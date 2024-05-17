import { useFormBlockContext } from '@tachybase/client';
import { useEffect } from 'react';
import { useContextApprovalExecution } from '../../context/ApprovalExecution';

export function useApprovalDetailBlockProps() {
  const { snapshot } = useContextApprovalExecution();
  const { form } = useFormBlockContext();

  useEffect(() => {
    form.setValues(snapshot);
  }, [form, snapshot]);

  return { form };
}
