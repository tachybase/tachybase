import { useFieldSchema, useForm } from '@formily/react';
import {
  TableFieldResource,
  __UNSAFE__,
  isVariable,
  transformVariableValue,
  useBlockRequestContext,
  useCollection_deprecated,
  useCompile,
  useFilterByTk,
  useLocalVariables,
  useVariables,
} from '@nocobase/client';
import { useNavigate } from 'react-router-dom';
import { App, Modal, message } from 'antd';
import { isURL } from '@nocobase/utils/client';

import React from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';

export const useCustomizeUpdateActionProps = () => {
  const { resource, __parent, service } = useBlockRequestContext();
  const filterByTk = useFilterByTk();
  const actionSchema = useFieldSchema();
  const navigate = useNavigate();
  const compile = useCompile();
  const form = useForm();
  const { modal } = App.useApp();
  const variables = useVariables();
  const localVariables = useLocalVariables({ currentForm: form });
  const { name, getField } = useCollection_deprecated();
  const { confirm } = Modal;
  return {
    async onClick() {
      const {
        assignedValues: originalAssignedValues = {},
        onSuccess,
        skipValidator,
        sessionUpdate,
      } = actionSchema?.['x-action-settings'] ?? {};
      if (sessionUpdate) {
        confirm({
          title: '问询',
          content: '确认要继续此操作？',
          icon: <ExclamationCircleFilled />,
          onOk() {
            sessionUpdatePopconfirm();
          },
          onCancel() {
            message.warning('取消更新');
          },
        });
      } else {
        sessionUpdatePopconfirm();
      }

      async function sessionUpdatePopconfirm() {
        const assignedValues = {};
        const waitList = Object.keys(originalAssignedValues).map(async (key) => {
          const value = originalAssignedValues[key];
          const collectionField = getField(key);

          if (process.env.NODE_ENV !== 'production') {
            if (!collectionField) {
              throw new Error(`useCustomizeUpdateActionProps: field "${key}" not found in collection "${name}"`);
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

        if (skipValidator === false) {
          await form.submit();
        }
        await resource.update({
          filterByTk,
          values: { ...assignedValues },
        });
        service?.refresh?.();
        if (!(resource instanceof TableFieldResource)) {
          __parent?.service?.refresh?.();
        }
        if (!onSuccess?.successMessage) {
          return;
        }
        if (onSuccess?.manualClose) {
          modal.success({
            title: compile(onSuccess?.successMessage),
            onOk: async () => {
              if (onSuccess?.redirecting && onSuccess?.redirectTo) {
                if (isURL(onSuccess.redirectTo)) {
                  window.location.href = onSuccess.redirectTo;
                } else {
                  navigate(onSuccess.redirectTo);
                }
              }
            },
          });
        } else {
          message.success(compile(onSuccess?.successMessage));
          if (onSuccess?.redirecting && onSuccess?.redirectTo) {
            if (isURL(onSuccess.redirectTo)) {
              window.location.href = onSuccess.redirectTo;
            } else {
              navigate(onSuccess.redirectTo);
            }
          }
        }
      }
    },
  };
};
