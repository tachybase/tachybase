import { FormV2, withDynamicSchemaProps } from '@tachybase/client';

export const StepForm = withDynamicSchemaProps(
  () => {
    return <FormV2></FormV2>;
  },
  {
    displayName: 'StepForm',
  },
);
