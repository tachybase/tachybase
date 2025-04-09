import { useActionContext, useDataBlockRequest, useDataBlockResource } from '@tachybase/client';
import { useField, useForm } from '@tachybase/schema';

import { App } from 'antd';

// 创建OCR提供商
export const useCreateProviderAction = () => {
  const { setVisible } = useActionContext();
  const form = useForm();
  const { refreshAsync } = useDataBlockRequest();
  const resource = useDataBlockResource();

  return {
    async onClick() {
      const values = await form.submit();
      await resource.create({
        values,
      });
      setVisible(false);
      await refreshAsync();
    },
  };
};
