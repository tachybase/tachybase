import {
  getFormValues,
  isVariable,
  transformVariableValue,
  useActionContext,
  useBlockRequestContext,
  useCollection,
  useCollection_deprecated,
  useCompile,
  useDataBlockRequest,
  useDataBlockResource,
  useFilterByTk,
  useFormActiveFields,
  useFormBlockContext,
  useLocalVariables,
  useParamsFromRecord,
  useVariables,
} from '@tachybase/client';
import { useField, useFieldSchema, useForm } from '@tachybase/schema';
import { isURL } from '@tachybase/utils';

import { App } from 'antd';
import { useNavigate } from 'react-router-dom';

export const useApiLogsConfigEnableProps = () => {
  const { field } = useBlockRequestContext();
  const resource = useDataBlockResource();
  const { refresh } = useDataBlockRequest();

  return {
    async onClick() {
      if (!field?.data?.selectedRowKeys?.length) {
        return;
      }

      try {
        await resource.update({
          filterByTk: field.data?.selectedRowKeys,
          values: { apiConfig: true },
        });
        field.data.selectedRowKeys = [];
        refresh?.();
      } catch (error) {
        console.error('Error enabling API logs config:', error);
      }
    },
  };
};

export const useApiLogsConfigDisenableProps = () => {
  const { field } = useBlockRequestContext();
  const resource = useDataBlockResource();
  const { refresh } = useDataBlockRequest();

  return {
    async onClick() {
      if (!field?.data?.selectedRowKeys?.length) {
        return;
      }

      try {
        await resource.update({
          filterByTk: field.data?.selectedRowKeys,
          values: { apiConfig: false },
        });
        field.data.selectedRowKeys = [];
        refresh?.();
      } catch (error) {
        console.error('Error disenabling API logs config:', error);
      }
    },
  };
};

export const useApiLogsConfigSyncProps = () => {
  const { field } = useBlockRequestContext();
  const resource = useDataBlockResource();
  const { refresh } = useDataBlockRequest();

  return {
    async onClick() {
      try {
        await resource.tablesync({ name: 'tablesync' });
        // field.data.selectedRowKeys = [];
        refresh?.();
      } catch (error) {
        console.error('Error sync API logs config:', error);
      }
    },
  };
};
