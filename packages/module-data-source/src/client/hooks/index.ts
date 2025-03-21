import { useActionContext, useAPIClient, useDataBlockRequest, useDataBlockResource } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { message } from 'antd';
import { useTranslation } from 'react-i18next';

import { NAMESPACE } from '../locale';

export const useTestConnectionAction = () => {
  const form = useForm();
  const api = useAPIClient();
  const { t } = useTranslation();
  const actionField = useField();
  actionField.data = actionField.data || {};
  return {
    async onClick() {
      await form.submit();
      try {
        actionField.data.loading = true;
        await api.resource('dataSources').testConnection({
          values: form.values,
        });
        actionField.data.loading = false;
        message.success(t('Connection successful', { ns: NAMESPACE }));
      } catch (error) {
        actionField.data.loading = false;
      }
    },
  };
};

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
