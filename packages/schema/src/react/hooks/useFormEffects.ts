import { Form } from '../../core';
import { unstable_useCompatFactory } from '../../reactive-react';
import { uid } from '../../shared';
import { useForm } from './useForm';

export const useFormEffects = (effects?: (form: Form) => void) => {
  const form = useForm();
  unstable_useCompatFactory(() => {
    const id = uid();
    form.addEffects(id, effects);
    return {
      dispose() {
        form.removeEffects(id);
      },
    };
  });
};
