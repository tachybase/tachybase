import { useFormBlockContext } from '@tachybase/client';

export function useApprovalFormBlockProps() {
  const { form } = useFormBlockContext();
  return { form };
}
