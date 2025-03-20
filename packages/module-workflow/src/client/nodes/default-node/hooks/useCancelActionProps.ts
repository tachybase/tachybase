import { useActionContext } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

export function useCancelActionProps() {
  const ctx = useActionContext();
  const form = useForm();

  return {
    async onClick() {
      ctx?.setVisible?.(false);
      form.reset();
    },
  };
}
