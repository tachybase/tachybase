import { useContextStepsForm } from '../contexts/stepsForm';

export function useStepsFormNextActionProps() {
  const contextStepsForm = useContextStepsForm();
  return {
    disabled: contextStepsForm.currentStep === contextStepsForm.stepsCount - 1,
    onClick: async () => {
      // TODO: Implement logic to submit form data and move to next step
      await contextStepsForm.nextStep();
    },
  };
}
