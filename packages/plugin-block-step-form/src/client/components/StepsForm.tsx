import { useState } from 'react';
import { DndContext, FormV2, useDesignable, useFormBlockProps, withDynamicSchemaProps } from '@tachybase/client';
import { RecursionField, useFieldSchema } from '@tachybase/schema';

import { App as AntdApp, message } from 'antd';

import { ProviderContextStepsForm } from '../contexts/stepsForm';
import { tval, useTranslation } from '../locale';
import { getSchemaStepItem } from '../schemas/stepItem';
import { AddStepDesignable } from './AddStep.dn';
import { AntdStepList } from './AntdStepList';

const extractCollectionFields = (schema) => {
  const collectionFields = [];
  const traverse = (node) => {
    if (node['x-component'] === 'CollectionField') {
      collectionFields.push(node);
    } else if (node.properties) {
      Object.keys(node.properties).forEach((key) => traverse(node.properties[key]));
    }
  };
  traverse(schema);

  const pathList = collectionFields.map((field) => {
    const path = [];
    let current = field;
    while (current.parent && current !== schema) {
      path.unshift(current.name);
      current = current.parent;
    }
    return path.join('.');
  });

  return pathList;
};

const isValidMove = (fromIndex, toIndex) => {
  return (
    Number.isInteger(fromIndex) && Number.isInteger(toIndex) && fromIndex !== toIndex && fromIndex >= 0 && toIndex >= 0
  );
};

export const StepsForm = withDynamicSchemaProps(
  ({ collection, dataSource, isEdit }) => {
    const fieldSchema = useFieldSchema();
    const [currentStep, setCurrentStep] = useState(0);
    const { t } = useTranslation();

    const { form } = useFormBlockProps();
    const filedSchema = useFieldSchema();
    const { dn, insertBeforeEnd } = useDesignable();

    const antdApp = AntdApp.useApp();

    const items = fieldSchema
      ?.reduceProperties((list, currentSchema) => {
        if (currentSchema['x-component'].includes('StepsForm.Step')) {
          currentSchema['x-linkage-rules'] = fieldSchema.parent?.['x-linkage-rules'];

          const schemaProps = currentSchema['x-component-props'];

          list.push({
            title: schemaProps?.title || currentSchema.title,
            contentSchema: currentSchema,
            uid: schemaProps?.uid,
            name: schemaProps.name,
            index: schemaProps.index,
          });
        }
        return list;
      }, [])
      .sort((a, b) => a.index - b.index);

    const stepsCount = items.length;

    const handleStepReorder = () => {};

    const addStep = () => {
      const stepItemSchema = getSchemaStepItem({
        title: `${t('Step')} ${stepsCount + 1}`,
        dataSource,
        collection,
        isEdit,
      });

      insertBeforeEnd(stepItemSchema);
    };

    const nextStep = async () => {
      try {
        const contentSchema = form[currentStep].contentSchema;

        const collectionFieldPaths = extractCollectionFields(contentSchema);

        const validations = form
          .query('*')
          .filter((field) => collectionFieldPaths.includes(field.address?.entire))
          .map((field) => field.validate?.());

        await Promise.all(validations);

        setCurrentStep(currentStep === stepsCount - 1 ? currentStep : currentStep + 1);
      } catch (err) {
        console.error(err);
        message.warning(err.messages?.[0]);
      }
    };

    const previousStep = () => {
      setCurrentStep(currentStep === 0 ? currentStep : currentStep - 1);
    };
    const deleteStep = (target) => {
      if (stepsCount === 1) {
        message.warning(tval('Cannot delete the last step.'));
        return;
      }

      antdApp.modal.confirm({
        title: tval('Confirm to delete step'),
        content: tval('Are you sure to delete this step?'),
        onOk: () => {
          dn.remove(fieldSchema.properties[target]);
        },
      });
    };

    const changeStepTitle = (target, title) => {
      const currentSchema = fieldSchema.properties[target];
      dn.emit('patch', {
        schema: {
          'x-uid': currentSchema['x-uid'],
          'x-component-props': {
            ...currentSchema['x-component-props'],
            title,
          },
        },
      });
    };

    const reorderSteps = (fromIndex, toIndex) => {
      // 参数有效性校验
      if (!isValidMove(fromIndex, toIndex)) {
        return;
      }

      // 执行数组元素移动
      const movedItem = items.splice(fromIndex, 1)[0];

      if (fromIndex < toIndex) {
        items.splice(toIndex, 0, movedItem);
      } else if (toIndex === 0) {
        items.unshift(movedItem);
      } else {
        items.splice(toIndex, 0, movedItem);
      }

      // 更新字段属性
      form.forEach((step, index) => {
        const stepSchema = fieldSchema.properties[step.name];
        stepSchema['x-index'] = index + 200;
        stepSchema['x-component-props'].index = index + 200;
      });

      // 触发设计器更新
      dn.emit('batchPatch', {
        schemas: form.map((step) => ({
          'x-uid': step['x-uid'],
          'x-index': step['x-index'],
          'x-component-props': {
            ...step['x-component-props'],
            index: step['x-index'],
          },
        })),
      });

      dn.refresh();
    };

    return (
      <ProviderContextStepsForm
        value={{
          isEdit,
          form,
          items,
          stepsCount,
          currentStep,
          setCurrentStep,
          addStep,
          nextStep,
          previousStep,
          deleteStep,
          changeStepTitle,
          stepDragEnd: reorderSteps,
        }}
      >
        <div style={{ display: 'flex', overflow: 'auto' }}>
          <DndContext onDragEnd={handleStepReorder}>
            <AntdStepList current={currentStep} items={items} />
          </DndContext>
          <AddStepDesignable onClick={addStep} />
        </div>
        <div>
          <>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  visibility: currentStep === index ? 'visible' : 'hidden',
                  height: currentStep === index ? 'auto' : 0,
                  opacity: currentStep === index ? 1 : 0,
                  transition: 'all 0.3s ease-in-out',
                  overflow: 'hidden',
                }}
              >
                <RecursionField
                  name={`step.${index}`}
                  schema={items[index].contentSchema}
                  onlyRenderProperties={true}
                />
              </div>
            ))}
          </>
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
    displayName: 'StepsForm',
  },
);

// @ts-ignore
StepsForm.Step = function () {
  return null;
};
