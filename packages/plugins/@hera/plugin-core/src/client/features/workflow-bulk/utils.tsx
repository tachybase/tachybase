import { SchemaExpressionScopeContext, useField, useFieldSchema } from '@tachybase/schema';
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
} from '@nocobase/client';
import { App } from 'antd';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../locale';

export const useCustomizeBulkWorkflowActionProps = () => {
  const { field, resource, __parent, service } = useBlockRequestContext();
  const expressionScope = useContext(SchemaExpressionScopeContext);
  const actionSchema = useFieldSchema();
  const tableBlockContext = useTableBlockContext();
  const { rowKey } = tableBlockContext;
  const selectedRecordKeys =
    tableBlockContext.field?.data?.selectedRowKeys ?? expressionScope?.selectedRecordKeys ?? {};
  const navigate = useNavigate();
  const compile = useCompile();
  const { t } = useTranslation();
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
      const {
        bindWorkflow = false,
        assignedValues: originalAssignedValues = {},
        updateMode,
      } = actionSchema?.['x-action-settings'] ?? {};
      actionField.data = field.data || {};
      actionField.data.loading = true;

      if (!bindWorkflow) {
        return modal.info({
          title: t('Not bind workflow!'),
        });
      }

      const assignedValues = {};
      const waitList = Object.keys(originalAssignedValues).map(async (key) => {
        const value = originalAssignedValues[key];
        const collectionField = getField(key);

        if (process.env.NODE_ENV !== 'production') {
          if (!collectionField) {
            throw new Error(`useCustomizeBulkUpdateActionProps: field "${key}" not found in collection "${name}"`);
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
        title: t('Bulk update', { ns: 'client' }),
        content:
          updateMode === 'selected'
            ? t('Update selected data?', { ns: 'client' })
            : t('Update all data?', { ns: 'client' }),
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
