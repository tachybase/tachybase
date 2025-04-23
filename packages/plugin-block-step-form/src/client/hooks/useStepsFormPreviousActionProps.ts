import { useContextStepsForm } from '../contexts/stepsForm';

export function useStepsFormPreviousActionProps() {
  const contextStepsForm = useContextStepsForm();
  const { currentStep, previousStep } = contextStepsForm;
  return {
    disable: currentStep === 0,
    onClick: async () => {
      await previousStep();
    },
  };
}
