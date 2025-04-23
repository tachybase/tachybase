import { useContextStepsForm } from '../contexts/stepsForm';

export function useStepsFormNextActionProps() {
  const contextStepsForm = useContextStepsForm();
  const { currentStep, stepsCount, nextStep } = contextStepsForm;
  return {
    disabled: currentStep === stepsCount - 1,
    onClick: async () => {
      await nextStep();
    },
  };
}
