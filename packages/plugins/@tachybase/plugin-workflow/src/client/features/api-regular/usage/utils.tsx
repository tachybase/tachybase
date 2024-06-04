import { useContext } from 'react';
import {
  isVariable,
  transformVariableValue,
  useBlockRequestContext,
  useCollection_deprecated,
  useCompile,
  useLocalVariables,
  useRecord,
  useRequest,
  useTableBlockContext,
  useVariables,
} from '@tachybase/client';
import { SchemaExpressionScopeContext, useField, useFieldSchema } from '@tachybase/schema';

import { App } from 'antd';
import { useNavigate } from 'react-router-dom';

import { lang } from '../../../locale';

export const usePropsAPIRegular = () => {
  const { field, resource, __parent, service } = useBlockRequestContext();
  const actionSchema = useFieldSchema();
  const expressionScope = useContext(SchemaExpressionScopeContext);
  const tableBlockContext = useTableBlockContext();
  const { rowKey } = tableBlockContext;

  const navigate = useNavigate();
  const compile = useCompile();
  const actionField: any = useField();
  const { modal } = App.useApp();
  const variables = useVariables();
  const record = useRecord();
  const { name, getField } = useCollection_deprecated();
  const localVariables = useLocalVariables();
  const { run } = useRequest(
    {
      resource: 'workflows',
      action: 'trigger',
    },
    {
      manual: true,
    },
  );

  return {
    async onClick() {
      const selectedRecordKeys =
        tableBlockContext.field?.data?.selectedRowKeys ?? expressionScope?.selectedRecordKeys ?? [];

      const {
        bindWorkflow = false,
        assignedValues: originalAssignedValues = {},
        updateMode,
      } = actionSchema?.['x-action-settings'] ?? {};

      actionField.data = field.data || {};
      actionField.data.loading = true;

      if (!bindWorkflow) {
        return modal.info({
          title: lang('Not bind workflow!'),
        });
      }

      const assignedValues = {};
      const waitList = Object.keys(originalAssignedValues).map(async (key) => {
        const value = originalAssignedValues[key];
        const collectionField = getField(key);

        if (process.env.NODE_ENV !== 'production') {
          if (!collectionField) {
            throw new Error(`usePropsAPIRegular: field "${key}" not found in collection "${name}"`);
          }
        }

        if (isVariable(value)) {
          const result = await variables?.parseVariable(value, localVariables);
          if (result) {
            assignedValues[key] = transformVariableValue(result, { targetCollectionField: collectionField });
          }
        } else if (value != null && value !== '') {
          assignedValues[key] = value;
        }
      });
      await Promise.all(waitList);

      modal.confirm({
        title: lang('Bulk update', { ns: 'client' }),
        content:
          updateMode === 'selected'
            ? lang('Update selected data?', { ns: 'client' })
            : lang('Update all data?', { ns: 'client' }),
        async onOk() {
          run({
            filterByTk: bindWorkflow,
          });
          actionField.data.loading = false;
        },
        async onCancel() {
          actionField.data.loading = false;
        },
      });
    },
  };
};

function updateData() {
  // const updateData: { filter?: any; values: any; forceUpdate: boolean } = {
  //   values,
  //   filter,
  //   forceUpdate: false,
  // };
  // if (updateMode === 'selected') {
  //   if (!selectedRecordKeys?.length) {
  //     message.error(t('Please select the records to be updated'));
  //     return;
  //   }
  //   updateData.filter = { $and: [{ [rowKey || 'id']: { $in: selectedRecordKeys } }] };
  // }
  // if (!updateData.filter) {
  //   updateData.forceUpdate = true;
  // }
}
