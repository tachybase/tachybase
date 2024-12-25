import { useFormBlockContext } from '@tachybase/client';

export function useApprovalFormBlockProps(e) {
  const { form } = useFormBlockContext();
  return { form };
}
