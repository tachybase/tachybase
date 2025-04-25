import { FormV2 } from '@tachybase/client';
import { RecursionField, useFieldSchema } from '@tachybase/schema';

import { useContextStepsForm } from '../contexts/stepsForm';

export const StepForms = () => {
  const fieldSchema = useFieldSchema();
  const contextStepForm = useContextStepsForm();
  const { form, items, currentStep } = contextStepForm;
  return (
    <div>
      <>
        {items.map((item, index) => (
          <div
            key={item.name}
            style={{
              visibility: currentStep === index ? 'visible' : 'hidden',
              height: currentStep === index ? 'auto' : 0,
              opacity: currentStep === index ? 1 : 0,
              transition: 'all 0.3s ease-in-out',
              overflow: 'hidden',
            }}
          >
            <RecursionField name={`step.${index}`} schema={items[index].contentSchema} onlyRenderProperties={true} />
          </div>
        ))}
      </>
      <FormV2 form={form}>
        <RecursionField
          schema={fieldSchema}
          onlyRenderProperties={true}
          filterProperties={(schema) => {
            return schema['x-component'] !== 'StepFormContainer';
          }}
        />
      </FormV2>
    </div>
  );
};
