import React from 'react';
import { SchemaInitializerItemType, useCollectionManager_deprecated, Variable } from '@tachybase/client';

import { BaseTypeSets, defaultFieldNames, useWorkflowVariableOptions, ValueBlock, WorkflowVariableInput } from '../..';
import { lang, NAMESPACE } from '../../locale';
import { Instruction } from '../../nodes/default-node/interface';

function useDynamicExpressionCollectionFieldMatcher(field): boolean {
  if (!['belongsTo', 'hasOne'].includes(field.type)) {
    return false;
  }

  if (this.getCollection(field.collectionName)?.template === 'expression') {
    return true;
  }

  const fields = this.getCollectionFields(field.target);
  return fields.some((f) => f.interface === 'expression');
}

function DynamicExpression({ value, onChange }) {
  const { getCollectionFields, getCollection } = useCollectionManager_deprecated();
  const scope = useWorkflowVariableOptions({
    types: [useDynamicExpressionCollectionFieldMatcher.bind({ getCollectionFields, getCollection })],
  });

  return <Variable.Input value={value} onChange={onChange} scope={scope} />;
}

export default class extends Instruction {
  title = `{{t("Dynamic Calculation", { ns: "${NAMESPACE}" })}}`;
  type = 'dynamic-calculation';
  group = 'extended';
  icon = 'CalculatorOutlined';
  color = '#2f79b9';
  description = `{{t("Calculate an expression based on a calculation engine and obtain a value as the result. Variables in the upstream nodes can be used in the expression. The expression is dynamic one from an expression collections.", { ns: "${NAMESPACE}" })}}`;
  fieldset = {
    expression: {
      type: 'string',
      title: `{{t("Calculation expression", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'DynamicExpression',
      required: true,
    },
    scope: {
      type: 'string',
      title: `{{t("Variable datasource", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowVariableInput',
      'x-component-props': {
        changeOnSelect: true,
        variableOptions: {
          types: [{ type: 'reference', options: { collection: '*', entity: true } }],
        },
      },
      'x-reactions': {
        dependencies: ['expression'],
        fulfill: {
          state: {
            visible: '{{$deps[0]}}',
          },
        },
      },
    },
    remarks: {
      type: 'string',
      title: `{{t("Remarks", { ns: "${NAMESPACE}" })}}`,
      'x-decorator': 'FormItem',
      'x-component': 'Input.TextArea',
      'x-component-props': {
        autoSize: {
          minRows: 3,
        },
        placeholder: `{{t("Input remarks", { ns: "${NAMESPACE}" })}}`,
      },
    },
  };
  components = {
    DynamicExpression,
    WorkflowVariableInput,
    ValueBlock,
  };
  useVariables({ key, title }, { types, fieldNames = defaultFieldNames }) {
    if (
      types &&
      !types.some((type) => type in BaseTypeSets || Object.values(BaseTypeSets).some((set) => set.has(type)))
    ) {
      return null;
    }
    return {
      [fieldNames.value]: key,
      [fieldNames.label]: title,
    };
  }
  useInitializers(node): SchemaInitializerItemType {
    return {
      name: `#${node.id}`,
      type: 'item',
      title: node.title ?? `#${node.id}`,
      Component: ValueBlock.Initializer,
      node,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      resultTitle: lang('Calculation result'),
    };
  }
}
