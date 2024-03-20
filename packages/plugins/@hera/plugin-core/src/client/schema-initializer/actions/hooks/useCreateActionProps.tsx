import { ISchema, useField, useFieldSchema, useForm } from '@formily/react';
import {
  __UNSAFE__,
  getFormValues,
  isVariable,
  transformVariableValue,
  useActionContext,
  useBlockRequestContext,
  useCollection_deprecated,
  useCompile,
  useDesignable,
  useFilterByTk,
  useFormActiveFields,
  useLocalVariables,
  useRecord,
  useVariables,
} from '@nocobase/client';
import { useTranslation } from 'react-i18next';
import { App, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { isURL } from '@nocobase/utils/client';
import { useCallback } from 'react';
import _ from 'lodash';
import { tval } from '../../../locale';

const pageDetailsViewer = 'PageLayout';

const viewerSchema: ISchema = {
  type: 'void',
  title: tval('View record'),
  'x-component': pageDetailsViewer,
  'x-component-props': {
    className: 'nb-action-popup',
  },
  properties: {
    page: {
      type: 'void',
      title: tval('Detail page'),
      'x-designer': 'Page.Designer',
      'x-component': 'Page',
      'x-component-props': { disablePageHeader: true },
      properties: {
        grid: {
          type: 'void',
          'x-component': 'Grid',
          'x-initializer': 'RecordBlockInitializers',
          properties: {},
        },
      },
    },
  },
};

export const useInsertSchema = () => {
  const fieldSchema = useFieldSchema();
  const { insertAfterBegin } = useDesignable();
  const insert = useCallback(
    (ss) => {
      const schema = fieldSchema.reduceProperties((buf, s) => {
        if (s['x-component'] === pageDetailsViewer) {
          return s;
        }
        return buf;
      }, null);
      if (!schema) {
        insertAfterBegin(_.cloneDeep(ss));
      }
    },
    [pageDetailsViewer],
  );
  return insert;
};

export const useCreateActionProps = () => {
  const form = useForm();
  const { field, resource, __parent } = useBlockRequestContext();
  const { setVisible, fieldSchema } = useActionContext();
  const navigate = useNavigate();
  const actionSchema = useFieldSchema();
  const actionField = useField();
  const { fields, getField, getTreeParentField, name } = useCollection_deprecated();
  const compile = useCompile();
  const filterByTk = useFilterByTk();
  const currentRecord = useRecord();
  const { modal } = App.useApp();
  const variables = useVariables();
  const localVariables = useLocalVariables({ currentForm: form });
  const { getActiveFieldsName } = useFormActiveFields() || {};
  const { t } = useTranslation();
  const action = actionField.componentProps.saveMode || 'create';
  const filterKeys = actionField.componentProps.filterKeys?.checked || [];
  const dn = useDesignable();
  const params = useParams();
  const insert = useInsertSchema();
  let fieldSchema2 = useFieldSchema();
  return {
    async onClick() {
      const fieldNames = fields.map((field) => field.name);
      const {
        assignedValues: originalAssignedValues = {},
        onSuccess,
        overwriteValues,
        skipValidator,
        triggerWorkflows,
        pageMode,
      } = actionSchema?.['x-action-settings'] ?? {};
      const addChild = fieldSchema?.['x-component-props']?.addChild;
      const assignedValues = {};

      const waitList = Object.keys(originalAssignedValues).map(async (key) => {
        const value = originalAssignedValues[key];
        const collectionField = getField(key);

        if (process.env.NODE_ENV !== 'production') {
          if (!collectionField) {
            throw new Error(`useCreateActionProps: field "${key}" not found in collection "${name}"`);
          }
        }

        if (isVariable(value)) {
          const result = await variables?.parseVariable(value, localVariables);
          if (result) {
            assignedValues[key] = transformVariableValue(result, { targetCollectionField: collectionField });
          }
        } else if (value !== null && value !== '') {
          assignedValues[key] = value;
        }
      });
      await Promise.all(waitList);

      if (!skipValidator) {
        await form.submit();
      }
      const values = getFormValues({
        filterByTk,
        field,
        form,
        fieldNames,
        getField,
        resource,
        actionFields: getActiveFieldsName?.('form') || [],
      });
      // const values = omitBy(formValues, (value) => isEqual(JSON.stringify(value), '[{}]'));
      if (addChild) {
        const treeParentField = getTreeParentField();
        values[treeParentField?.name ?? 'parent'] = currentRecord?.__parent;
        values[treeParentField?.foreignKey ?? 'parentId'] = currentRecord?.__parent?.id;
      }
      actionField.data = field.data || {};
      actionField.data.loading = true;
      try {
        const data = await resource[action]({
          values: {
            ...values,
            ...overwriteValues,
            ...assignedValues,
          },
          filterKeys: filterKeys,
          // TODO(refactor): should change to inject by plugin
          triggerWorkflows: triggerWorkflows?.length
            ? triggerWorkflows.map((row) => [row.workflowKey, row.context].filter(Boolean).join('!')).join(',')
            : undefined,
        });
        actionField.data.loading = false;
        actionField.data.data = data;
        __parent?.service?.refresh?.();
        if (!onSuccess?.successMessage) {
          if (pageMode) {
            message.success(t('Saved successfully'));
            if (dn.designable) {
              insert(viewerSchema);
            }
            fieldSchema2.reduceProperties((buf, s) => {
              if (s['x-component'] === pageDetailsViewer) {
                fieldSchema2 = s;
                return s;
              }
              return buf;
            });
            if (fieldSchema2['x-component'] === pageDetailsViewer) {
              navigate(`page/${fieldSchema2['x-uid']}/records/${name}/${data?.data?.data?.id ?? ''}`);
            }
            await form.reset();
            return;
          }
        }
        if (!onSuccess?.dataClear) {
          await form.reset();
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

        if (!onSuccess) {
          setVisible?.(false);
        }
      } catch (error) {
        actionField.data.loading = false;
      }
    },
  };
};
