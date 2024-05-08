import { useFormBlockContext } from '@tachybase/client';
import { useEffect } from 'react';
import { useContextApprovalExecutions } from '../Pd.ApprovalExecutions';

export function useApprovalDetailBlockProps() {
  const { snapshot } = useContextApprovalExecutions();
  const { form } = useFormBlockContext();

  useEffect(() => {
    form.setValues(snapshot);
  }, [form, snapshot]);

  return { form };
}
