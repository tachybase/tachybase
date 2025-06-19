import { useContextStepsForm } from '../contexts/stepsForm';

export function useStepsFormPreviousActionProps() {
  const contextStepsForm = useContextStepsForm();
  const { currentStep, previousStep } = contextStepsForm;
  return {
    disabled: currentStep === 0,
    onClick: async () => {
      await previousStep();
    },
  };
}
