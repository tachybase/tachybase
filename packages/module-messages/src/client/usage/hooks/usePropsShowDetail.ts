import { useEffect } from 'react';
import { useFormBlockContext } from '@tachybase/client';

import { useContextMessage } from '../contexts/Message';

// 设置详情数据
export function usePropsShowDetail() {
  const { snapshot } = useContextMessage();
  const { form } = useFormBlockContext();

  useEffect(() => {
    form.setValues(snapshot || {});
  }, [form, snapshot]);

  return { form };
}
