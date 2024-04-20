import { useFieldSchema } from '@nocobase/schema';
import { App } from 'antd';
import { useMatch } from 'react-router-dom';
import { useTranslation } from '../locale';

export function usePageSettingsProps() {
  const isAdmin = useMatch('/admin/:name');
  const isEmbed = useMatch('/embed/:name');
  const currentRoute = isAdmin || isEmbed;
  const fieldSchema = useFieldSchema();
  const { message, notification } = App.useApp();
  const { t } = useTranslation();
  return {
    title: t('Copy embedded link'),
    onClick: () => {
      const link = window.location.href
        .replace('/admin', '/embed')
        .replace(currentRoute.params.name, fieldSchema['x-uid'])
        .replace(window.location.search || '', '');
      navigator.clipboard
        .writeText(link)
        .then(() => {
          message.success(t('Copy successful'));
        })
        .catch((error) => {
          notification.error({ message: t('Copy Failed'), description: error.message, placement: 'topRight' });
        });
    },
  };
}
