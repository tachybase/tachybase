import { FormV2, withDynamicSchemaProps } from '@tachybase/client';

import { BlockName } from '../constants';

export const StepForm = withDynamicSchemaProps(
  () => {
    return <FormV2></FormV2>;
  },
  {
    displayName: BlockName,
  },
);
