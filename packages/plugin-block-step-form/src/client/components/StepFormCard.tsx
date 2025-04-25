import { useState } from 'react';
import { useDesignable, useFormBlockProps, withDynamicSchemaProps } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { App as AntdApp, message } from 'antd';

import { ProviderContextStepsForm } from '../contexts/stepsForm';
import { tval, useTranslation } from '../locale';
import { getSchemaStepItem } from '../schemas/stepItem';
import { extractCollectionFields } from '../tools/extractCollectionFields';
import { isValidMove } from '../tools/isValidMove';
import { StepForms } from './StepForms';
import { StepLine } from './StepLine';

export const StepFormCard = withDynamicSchemaProps(
  ({ collection, dataSource, isEdit }) => {
    const fieldSchema = useFieldSchema();
    const [currentStep, setCurrentStep] = useState(0);
    const { t } = useTranslation();

    const { form } = useFormBlockProps();

    const { dn, insertBeforeEnd } = useDesignable();

    const antdApp = AntdApp.useApp();

    const items = fieldSchema
      ?.reduceProperties((list, currentSchema) => {
        if (`${currentSchema?.['x-component']}`.includes('StepFormContainer')) {
          currentSchema['x-linkage-rules'] = fieldSchema.parent?.['x-linkage-rules'];
          const schemaProps = currentSchema['x-component-props'] || {};
          const { title, uid, name, index } = schemaProps;

          list.push({
            index: index,
            uid: uid,
            name: name,
            title: title || currentSchema.title,
            contentSchema: currentSchema,
          });
        }
        return list;
      }, [])
      .sort((a, b) => a.index - b.index);

    const stepsCount = items.length;

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
        const contentSchema = items[currentStep].contentSchema;

        const collectionFieldPaths = extractCollectionFields(contentSchema);

        const validations = form
          .query('*')
          .map((i) => i)
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
      items.forEach((step, index) => {
        const stepSchema = fieldSchema.properties[step.name];
        stepSchema['x-index'] = index + 200;
        stepSchema['x-component-props'].index = index + 200;
      });

      // 触发设计器更新
      dn.emit('batchPatch', {
        schemas: items.map((step) => ({
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

    const contextValue = {
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
    };
    return (
      <ProviderContextStepsForm value={contextValue}>
        <StepLine />
        <StepForms />
      </ProviderContextStepsForm>
    );
  },
  {
    displayName: 'StepFormList',
  },
);
