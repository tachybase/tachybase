import { useForm } from '@tachybase/schema';

export function useFormProviderProps() {
  return { form: useForm() };
}
