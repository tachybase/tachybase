import { useBlockRequestContext, useDataBlockRequest, useDataBlockResource, useTranslation } from '@tachybase/client';

import { message } from 'antd';

export const useApiLogsConfigEnableProps = () => {
  const { t } = useTranslation();
  const { field } = useBlockRequestContext();
  const resource = useDataBlockResource();
  const { refresh } = useDataBlockRequest();

  return {
    async onClick() {
      if (!field?.data?.selectedRowKeys?.length) {
        return message.error(t('Please select the records you want to enable'));
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
  const { t } = useTranslation();
  const { field } = useBlockRequestContext();
  const resource = useDataBlockResource();
  const { refresh } = useDataBlockRequest();

  return {
    async onClick() {
      if (!field?.data?.selectedRowKeys?.length) {
        return message.error(t('Please select the records you want to disable'));
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
