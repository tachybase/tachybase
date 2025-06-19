import { useCustomizeRequestActionProps } from '@tachybase/client';

import { useContextStepsForm } from '../contexts/stepsForm';

export function useStepsFormCustomActionProps(params) {
  const contextStepsForm = useContextStepsForm();
  return {
    ...params,
    useCustomizeRequestActionProps,
    disabled: contextStepsForm.currentStep !== contextStepsForm.stepsCount - 1,
  };
}
