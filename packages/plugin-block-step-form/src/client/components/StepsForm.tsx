import { useState } from 'react';
import { DndContext, FormV2, useDesignable, useFormBlockProps, withDynamicSchemaProps } from '@tachybase/client';
import { RecursionField, useFieldSchema } from '@tachybase/schema';

import { message } from 'antd';

import { BlockName } from '../constants';
import { ProviderContextStepsForm } from '../contexts/stepsForm';

export const StepsForm = withDynamicSchemaProps(
  (props) => {
    const { collection, dataSource, isEdit } = props;
    const fieldSchema = useFieldSchema();
    const { designable } = useDesignable();
    const [currentStep, setStep] = useState(0);

    const steps = fieldSchema?.reduceProperties((list, schema) => {
      if (schema['x-component'].includes('Step')) {
        list.push({
          title: schema.title,
          schema: schema,
          uid: schema['x-uid'],
        });
      }
      return list;
    }, []);

    const { form } = useFormBlockProps();
    const filedSchema = useFieldSchema();

    const nextStep = async () => {
      try {
        // await validateCurrentStep();
        setStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
      } catch (error) {
        message.warning(error.messages[0]);
      }
    };

    const handleStepReorder = () => {};

    return (
      <ProviderContextStepsForm value={{ currentStep, steps }}>
        <div>
          <DndContext onDragEnd={handleStepReorder}>
            {steps?.map(
              (step) => null,
              // <StepPanel key={step.uid} visible={step.index === currentStep}>
              //   <FormilyField schema={step.schema} />
              // </StepPanel>
            )}
          </DndContext>
        </div>
        <div>
          <FormV2 form={form}>
            <RecursionField
              schema={filedSchema}
              onlyRenderProperties={true}
              filterProperties={(schema) => {
                return schema['x-component'] !== 'StepsForm.Step';
              }}
            />
          </FormV2>
        </div>
      </ProviderContextStepsForm>
    );
  },
  {
    displayName: BlockName,
  },
);
