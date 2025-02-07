import {
  getFormValues,
  isVariable,
  mergeFilter,
  removeNullCondition,
  transformVariableValue,
  useActionContext,
  useBlockRequestContext,
  useCollection,
  useCompile,
  useDataBlockProps,
  useDataBlockRequest,
  useDataLoadingMode,
  useFilterByTk,
  useFilterOptions,
  useFormActiveFields,
  useFormBlockContext,
  useLocalVariables,
  useParamsFromRecord,
  useVariables,
} from '@tachybase/client';
import { Field, useField, useFieldSchema, useForm } from '@tachybase/schema';

import { App } from 'antd';
import _ from 'lodash';
// import { isURL } from "@tachybase/utils";
import { useNavigate } from 'react-router-dom';

import { useTranslation } from '../../../locale';

export const useOwnersFilterActionProps = () => {
  const { name } = useCollection();
  const options = useFilterOptions(name);
  const service = useDataBlockRequest();
  const props = useDataBlockProps();
  return useOwnersFilterFieldProps({ options, service, params: props?.params });
};

export const useOwnersFilterFieldProps = ({ options, service, params }) => {
  const { t } = useTranslation();
  const field = useField<Field>();
  const dataLoadingMode = useDataLoadingMode();

  return {
    options,
    onSubmit(values) {
      // filter parameter for the block
      const defaultFilter = params.filter;
      // filter parameter for the filter action
      const filter = removeNullCondition(values?.filter) as any;

      if (dataLoadingMode === 'manual' && _.isEmpty(filter)) {
        return service.mutate(undefined);
      }

      const filters = service.params?.[1]?.filters || {};
      filters[`filterAction`] = filter;
      service.run(
        { ...service.params?.[0], page: 1, filter: mergeFilter([...Object.values(filters), defaultFilter]) },
        { filters },
      );
      const items = filter?.$and || filter?.$or;
      if (items?.length) {
        field.title = t('{{count}} filter items', { count: items?.length || 0 });
      } else {
        field.title = t('Filter');
      }
    },
    onReset() {
      const filter = params.filter;
      const filters = service.params?.[1]?.filters || {};
      delete filters[`filterAction`];

      const newParams = [
        {
          ...service.params?.[0],
          filter: mergeFilter([...Object.values(filters), filter]),
          page: 1,
        },
        { filters },
      ];

      field.title = t('Filter');

      if (dataLoadingMode === 'manual') {
        service.params = newParams;
        return service.mutate(undefined);
      }

      service.run(...newParams);
    },
  };
};

export const useOwnersUpdateActionProps = () => {
  const form = useForm();
  const filterByTk = useFilterByTk();
  const { field, resource, __parent } = useBlockRequestContext();
  const { setVisible } = useActionContext();
  const actionSchema = useFieldSchema();
  const navigate = useNavigate();
  const { fields, getField, name } = useCollection();
  const compile = useCompile();
  const actionField = useField();
  const { updateAssociationValues } = useFormBlockContext();
  const { modal, message } = App.useApp();
  const data = useParamsFromRecord();
  const variables = useVariables();
  const localVariables = useLocalVariables({ currentForm: form });
  const { getActiveFieldsName } = useFormActiveFields() || {};

  return {
    async onClick() {
      const {
        assignedValues: originalAssignedValues = {},
        onSuccess,
        overwriteValues,
        skipValidator,
        triggerWorkflows,
        isDeltaChanged,
      } = actionSchema?.['x-action-settings'] ?? {};

      const assignedValues = {};
      const waitList = Object.keys(originalAssignedValues).map(async (key) => {
        const value = originalAssignedValues[key];
        const collectionField = getField(key);

        if (process.env.NODE_ENV !== 'production') {
          if (!collectionField) {
            throw new Error(`useUpdateActionProps: field "${key}" not found in collection "${name}"`);
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

      if (!skipValidator) {
        await form.submit();
      }
      const fieldNames = fields.map((field) => field.name);
      const actionFields = getActiveFieldsName?.('form') || [];
      const values = getFormValues({
        filterByTk,
        field,
        form,
        fieldNames,
        getField,
        resource,
        actionFields,
      });
      actionField.data = field.data || {};
      actionField.data.loading = true;

      const rawValues = {
        ...values,
        ...overwriteValues,
        ...assignedValues,
      };

      const filterValues = (srcValues) =>
        Object.entries(srcValues).reduce((obj, keyValuePair) => {
          const [key, value] = keyValuePair;
          if (actionFields.includes(key)) {
            obj = {
              ...obj,
              [key]: value,
            };
          }
          return obj;
        }, {});

      try {
        await resource.update({
          filterByTk,
          values: isDeltaChanged ? filterValues(rawValues) : rawValues,
          ...data,
          updateAssociationValues,
          // TODO(refactor): should change to inject by plugin
          triggerWorkflows: triggerWorkflows?.length
            ? triggerWorkflows.map((row) => [row.workflowKey, row.context].filter(Boolean).join('!')).join(',')
            : undefined,
        });
        actionField.data.loading = false;
        __parent?.service?.refresh?.();
        setVisible?.(false);
        if (!onSuccess?.successMessage) {
          return;
        }
        if (onSuccess?.manualClose) {
          modal.success({
            title: compile(onSuccess?.successMessage),
            onOk: async () => {
              await form.reset();
              if (onSuccess?.redirecting && onSuccess?.redirectTo) {
                // if (isURL(onSuccess.redirectTo)) {
                //     window.location.href = onSuccess.redirectTo;
              } else {
                navigate(onSuccess.redirectTo);
              }
            },
            // },
          });
        } else {
          message.success(compile(onSuccess?.successMessage));
          if (onSuccess?.redirecting && onSuccess?.redirectTo) {
            // if (isURL(onSuccess.redirectTo)) {
            //     window.location.href = onSuccess.redirectTo;
          } else {
            navigate(onSuccess.redirectTo);
          }
          // }
        }
      } catch (error) {
        actionField.data.loading = false;
      }
    },
  };
};
