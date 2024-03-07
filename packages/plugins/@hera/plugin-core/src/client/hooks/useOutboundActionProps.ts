import { message } from 'antd';
import { useFieldSchema } from '@formily/react';
import copy from 'copy-to-clipboard';

export const useOutboundActionProps = () => {
  let schema = useFieldSchema();

  while (!('x-decorator-props' in schema)) {
    schema = schema.parent;
  }
  const url = window.location.href.split('/', 3).join('/');
  return {
    async onClick() {
      const c = copy(`${url}/r/${schema['x-uid']}`);
      if (c) {
        message.success('链接保存成功');
      } else {
        message.success('链接保存失败');
      }
    },
  };
};
