import { useFormBlockContext } from '@nocobase/client';

export function useApprovalFormBlockProps(e) {
  const { form } = useFormBlockContext();
  return { form };
}
