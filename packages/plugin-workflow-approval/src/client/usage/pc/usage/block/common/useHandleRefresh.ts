import { useActionContext, useAPIClient, useTableBlockContext } from '@tachybase/client';

// NOTE: 用于处理关闭弹窗, 和刷新外边显示的表格
export function useHandleRefresh(delay = 500) {
  const { service } = useTableBlockContext();
  const { setVisible, setSubmitted } = useActionContext() as any;

  const refreshTable = () => {
    setVisible(false);
    setSubmitted?.(true);
    setTimeout(() => {
      service.refresh();
    }, delay);
  };

  return {
    refreshTable,
  };
}
