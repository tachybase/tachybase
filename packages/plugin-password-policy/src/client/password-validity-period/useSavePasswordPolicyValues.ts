import { useAPIClient, useTranslation } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { App } from 'antd';

import { COLLECTION_PASSWORD_POLICY } from '../../constants';

export const useSavePasswordPolicyValues = () => {
  const form = useForm();
  const { message } = App.useApp();
  const api = useAPIClient();
  const { t } = useTranslation();

  return {
    async run() {
      await form.submit();
      try {
        await api.request({
          url: `${COLLECTION_PASSWORD_POLICY}:set`,
          method: 'post',
          data: form.values,
        });
        message.success(t('Saved successfully'));
      } catch (error) {
        message.error(t('Failed to save settings'));
        throw error;
      }
    },
  };
};
