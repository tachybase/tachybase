import React from 'react';
import {
  useActionContext,
  useCollectionRecordData,
  useDataBlockRequest,
  useDataBlockResource,
} from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { LoadingOutlined } from '@ant-design/icons';
import { message, notification, Spin } from 'antd';

import { usePluginUtils } from '../utils';

export const useCreateDatabaseConnectionAction = () => {
  const form = useForm();
  const field = useField();
  const ctx = useActionContext();
  const service = useDataBlockRequest();
  const resource = useDataBlockResource();
  return {
    async onClick() {
      try {
        await form.submit();
        field.data = field.data || {};
        field.data.loading = true;
        await resource.create({ values: form.values });
        ctx.setVisible(false);
        await form.reset();
        field.data.loading = false;
        service.refresh();
      } catch (error) {
        if (field.data) {
          field.data.loading = false;
        }
      }
    },
  };
};

export const useMultiAppUpdateAction = (actionCallback?: (key: string, values: any) => void) => {
  const field = useField();
  const form = useForm();
  const ctx = useActionContext();
  // const { refresh } = useDataBlockRequest();
  const service = useDataBlockRequest();
  const resource = useDataBlockResource();
  const record = useCollectionRecordData();
  const filterByTk = record?.name;
  return {
    async onClick() {
      await form.submit();
      field.data = field.data || {};
      field.data.loading = true;
      try {
        const res = await resource.update({ filterByTk, values: form.values });
        ctx.setVisible(false);
        await form.reset();
        service.refresh();
        actionCallback?.(filterByTk, res?.data?.data);
      } catch (e) {
        console.error(e);
      } finally {
        field.data.loading = false;
      }
    },
  };
};

export const useStartAllAction = () => {
  const resource = useDataBlockResource();
  const { t } = usePluginUtils();
  return {
    async onClick() {
      const result = await resource.startAll();
      notification.info({
        key: 'subAppsChange',
        message: (
          <span>
            {t('Processing...')} &nbsp; &nbsp;
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </span>
        ),
        duration: 0,
      });
      if (result?.data?.data?.all === 0) {
        notification.info({
          key: 'subAppsChange',
          message: `${t('Start count')}: 0/0!`,
        });
      }
    },
  };
};

export const useStopAllAction = () => {
  const resource = useDataBlockResource();
  const { t } = usePluginUtils();
  return {
    async onClick() {
      const result = await resource.stopAll();
      notification.info({
        key: 'subAppsChange',
        message: (
          <span>
            {t('Processing...')} &nbsp; &nbsp;
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
          </span>
        ),
        duration: 0,
      });
      if (result?.data?.data?.all === 0) {
        notification.info({
          key: 'subAppsChange',
          message: `${t('Stop count')}: 0/0!`,
        });
      }
    },
  };
};
