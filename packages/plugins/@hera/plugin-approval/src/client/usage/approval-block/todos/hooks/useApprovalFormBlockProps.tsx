import { useFormBlockContext } from '@nocobase/client';

export function useApprovalFormBlockProps() {
  const { form } = useFormBlockContext();
  return { form };
}
