import { Form as FormType, IFormFeedback, isForm, ObjectField } from '@formily/core';
import { FormProvider, JSXComponent, RecordScope, useParentForm } from '@formily/react';
import React from 'react';
import { FormLayout, IFormLayoutProps } from '../form-layout';
import { PreviewText } from '../preview-text';
export interface FormProps extends IFormLayoutProps {
  form?: FormType;
  component?: JSXComponent;
  onAutoSubmit?: (values: any) => any;
  onAutoSubmitFailed?: (feedbacks: IFormFeedback[]) => void;
  previewTextPlaceholder?: React.ReactNode;
}

export const Form: React.FC<React.PropsWithChildren<FormProps>> = ({
  form,
  component,
  onAutoSubmit,
  onAutoSubmitFailed,
  previewTextPlaceholder,
  ...props
}) => {
  const top = useParentForm();
  const renderContent = (form: FormType | ObjectField) => (
    <RecordScope getRecord={() => (isForm(form) ? form.values : form.value)}>
      <PreviewText.Placeholder value={previewTextPlaceholder}>
        <FormLayout {...props}>
          {React.createElement(
            component as string,
            {
              onSubmit(e: React.FormEvent) {
                e?.stopPropagation?.();
                e?.preventDefault?.();
                form.submit(onAutoSubmit).catch(onAutoSubmitFailed);
              },
            },
            props.children,
          )}
        </FormLayout>
      </PreviewText.Placeholder>
    </RecordScope>
  );
  if (form) return <FormProvider form={form}>{renderContent(form)}</FormProvider>;
  if (!top) throw new Error('must pass form instance by createForm');
  return renderContent(top);
};

Form.defaultProps = {
  component: 'form',
};

export default Form;
