import { useCreateActionProps, useDesignable, useUpdateActionProps } from '@tachybase/client';

import { App as AntdApp } from 'antd';

import { useContextStepsForm } from '../contexts/stepsForm';

export function useStepsFormSubmitActionProps() {
  const contextStepsForm = useContextStepsForm();
  const createActionProps = useCreateActionProps();
  const updateActionProps = useUpdateActionProps();
  const { message } = AntdApp.useApp();
  return {
    htmlType: 'submit',
    disabled: contextStepsForm.currentStep !== contextStepsForm.stepsCount - 1,
    onClick: async () => {
      try {
        // 参数校验增强
        if (!contextStepsForm?.form) {
          throw new Error('Form context not initialized');
        }

        // 动态分支操作
        if (contextStepsForm.isEdit) {
          await updateActionProps?.onClick?.();
        } else {
          await createActionProps?.onClick?.();
        }

        // 重置表单步骤
        contextStepsForm.setCurrentStep(0);
      } catch (error) {
        const validationError = error?.[0];
        if (validationError?.address) {
          const formGraph = contextStepsForm.form.getFormGraph();
          const fieldTitle = formGraph?.[validationError.address]?.title;
          const errorMessage = validationError.messages?.[0] || 'Validation failed';
          message.warning(`${fieldTitle || ''} ${errorMessage}`);
        } else {
          console.error('System error:', error);
          message.error('Operation failed due to system error');
        }
        throw error;
      }
    },
  };
}
