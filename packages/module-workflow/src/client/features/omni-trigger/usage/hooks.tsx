import React, { useContext } from 'react';
import {
  getAfterWorkflows,
  getBeforeWorkflows,
  isVariable,
  transformVariableValue,
  useBlockRequestContext,
  useCollection_deprecated,
  useCompile,
  useLocalVariables,
  useNoticeSub,
  useRecord,
  useRequest,
  useTableBlockContext,
  useVariables,
} from '@tachybase/client';
import { SchemaExpressionScopeContext, useField, useFieldSchema } from '@tachybase/schema';

import { App, Progress } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { lang } from '../../../locale';

export const usePropsAPIRegular = () => {
  const { field, resource, __parent, service } = useBlockRequestContext();
  const actionSchema = useFieldSchema();
  const expressionScope: any = useContext(SchemaExpressionScopeContext);
  const tableBlockContext = useTableBlockContext();
  const { rowKey } = tableBlockContext;
  const { t } = useTranslation();

  const navigate = useNavigate();
  const compile = useCompile();
  const actionField: any = useField();
  const { modal, notification } = App.useApp();
  const variables = useVariables();
  // const record = useRecord();
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
  useNoticeSub('workflow:regular', (event) => {
    if (event.msg === 'start') {
      notification.info({
        key: 'workflow:regular',
        message: t('Start'),
        description: <Progress percent={0} />,
        duration: 0,
      });
    } else if (event.msg === 'progress') {
      const current = event.current + 1;
      const time = Math.floor((current / event.total) * 100) === 100 ? 3 : 0;
      notification.info({
        key: 'workflow:regular',
        message: `${t('Processing')}...`,
        description: <Progress percent={Math.floor((current / event.total) * 100)} />,
        duration: time,
      });
    } else if (event.msg === 'done') {
      notification.success({
        key: 'workflow:regular',
        message: t('Done'),
        description: <Progress percent={100} />,
        duration: 3,
      });
      service.refresh();
    }
  });

  return {
    async onClick() {
      const selectedRecordKeys =
        tableBlockContext.field?.data?.selectedRowKeys ?? expressionScope?.selectedRecordKeys ?? [];
      const { filter } = service.params?.[0] ?? {};

      const {
        bindWorkflow = false,
        triggerWorkflows = false,
        assignedValues: originalAssignedValues = {},
        updateMode,
      } = actionSchema?.['x-action-settings'] ?? {};

      const isUpdateSelected = updateMode === 'selected';
      const updateData = {
        primaryKey: rowKey || 'id',
        targetKeys: selectedRecordKeys,
      };

      actionField.data = field.data || {};
      actionField.data.loading = true;

      if (!triggerWorkflows && !bindWorkflow) {
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
        title: lang('Confirm', { ns: 'core' }),
        content: lang('Trigger workflow?'),
        async onOk() {
          if (bindWorkflow) {
            const params = {
              filterByTk: bindWorkflow,
              updateData: encodeURIComponent(JSON.stringify(updateData)),
            };
            run(params);
          } else if (triggerWorkflows) {
            if (isUpdateSelected) {
              await resource.trigger({
                filterByTk: selectedRecordKeys,
                triggerWorkflows: getAfterWorkflows(triggerWorkflows),
                beforeWorkflows: getBeforeWorkflows(triggerWorkflows),
              });
            } else {
              await resource.trigger({
                filter,
                triggerWorkflows: getAfterWorkflows(triggerWorkflows),
                beforeWorkflows: getBeforeWorkflows(triggerWorkflows),
              });
            }
          }
          // run(params);
          actionField.data.loading = false;
        },
        async onCancel() {
          actionField.data.loading = false;
        },
      });
    },
  };
};
