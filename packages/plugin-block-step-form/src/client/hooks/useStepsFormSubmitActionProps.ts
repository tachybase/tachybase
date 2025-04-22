import { useCreateActionProps, useUpdateActionProps } from '@tachybase/client';

import { App } from 'antd';

import { useContextStepsForm } from '../contexts/stepsForm';

export function useStepsFormSubmitActionProps() {
  const contextStepsForm = useContextStepsForm();
  const createActionProps = useCreateActionProps();
  const updateActionProps = useUpdateActionProps();
  const { message } = App.useApp();
  return {
    htmlType: 'submit',
    disabled: contextStepsForm.currentStep !== contextStepsForm.stepsCount - 1,
    onClick: () => {},
  };
}
