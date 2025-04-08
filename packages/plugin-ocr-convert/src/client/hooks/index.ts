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

// 更新OCR提供商
export const useUpdateProviderAction = () => {
  const { setVisible } = useActionContext();
  const form = useForm();
  const { refreshAsync } = useDataBlockRequest();
  const resource = useDataBlockResource();
  const { id } = useActionContext().record || {};

  return {
    async onClick() {
      const values = await form.submit();
      await resource.update({
        filterByTk: id,
        values,
      });
      setVisible(false);
      await refreshAsync();
    },
  };
};

// 删除OCR提供商
export const useRemoveProviderAction = () => {
  const { record } = useActionContext();
  const { refreshAsync } = useDataBlockRequest();
  const resource = useDataBlockResource();

  return {
    async onClick() {
      await resource.destroy({
        filterByTk: record.id,
      });
      await refreshAsync();
    },
  };
};
