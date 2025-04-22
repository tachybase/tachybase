import { useContextStepsForm } from '../contexts/stepsForm';

export function useStepsFormPreviousActionProps() {
  const contextStepsForm = useContextStepsForm();
  return {
    disable: contextStepsForm.currentStep === 0,
    onClick: async () => {
      await contextStepsForm.previousStep();
    },
  };
}
