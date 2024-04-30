import { message } from 'antd';
import { useFieldSchema } from '@tachybase/schema';
import copy from 'copy-to-clipboard';
import { useTranslation } from '../../locale';

export const useOutboundActionProps = () => {
  let schema = useFieldSchema();
  const { t } = useTranslation();

  while (!('x-decorator-props' in schema)) {
    schema = schema.parent;
  }
  // FIXME: 处理多应用路径
  const url = window.location.href.split('/', 3).join('/');
  return {
    async onClick() {
      const c = copy(`${url}/r/${schema['x-uid']}`);
      if (c) {
        message.success(t('Save link successful'));
      } else {
        message.success(t('Save link failed'));
      }
    },
  };
};
