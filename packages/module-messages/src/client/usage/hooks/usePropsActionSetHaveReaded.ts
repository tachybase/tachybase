import { useAPIClient, useDataBlockRequest, useTableBlockContext } from '@tachybase/client';

export function usePropsActionSetHaveReaded(props: any) {
  const { onClick } = props;
  const apiClient = useAPIClient();
  const { refresh } = useDataBlockRequest();
  const tableBlockContext = useTableBlockContext();

  const handleClick = async () => {
    onClick?.();
    // 拿到选中的 id 数组,
    const { collection, rowKey } = tableBlockContext;
    const selectedRowKeys = tableBlockContext.field?.data?.selectedRowKeys ?? [];
    // 将所有选中的记录, 没有变成已读的变成已读
    await apiClient.resource(collection).update({
      filter: {
        [rowKey]: { $in: selectedRowKeys },
      },
      values: {
        read: true,
      },
    });
    refresh?.();
  };

  return {
    ...props,
    onClick: handleClick,
  };
}
