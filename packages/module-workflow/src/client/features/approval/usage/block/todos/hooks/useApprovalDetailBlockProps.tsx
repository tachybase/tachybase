import { useEffect } from 'react';
import { useFormBlockContext } from '@tachybase/client';

import { useContextApprovalRecords } from '../Pd.ApprovalExecutions';

export function useApprovalDetailBlockProps() {
  const { snapshot } = useContextApprovalRecords();
  const { form } = useFormBlockContext();

  useEffect(() => {
    form.setValues(snapshot);
    // NOTE: 暂时的解决办法, form?.values?.account_pay_id 这个条件解决了问题, 意思是如果被修改了值, 然后重新修改回来. 在这个审批的特殊条件下, 写法是没问题的. 但是不是根源的解决办法, 也依赖了字段 account_pay_id
    // XXX: 需要重构, 寻找为何发生多次渲染, 导致设置的值, 被表单组件的默认值覆盖的问题.
    // 参考文件1: client/src/block-provider/FormBlockProvider.tsx
    // 参考文件1: src/client/features/approval/common/FormBlock.provider.tsx
  }, [form, snapshot, form?.values?.account_pay_id]);

  return { form };
}
