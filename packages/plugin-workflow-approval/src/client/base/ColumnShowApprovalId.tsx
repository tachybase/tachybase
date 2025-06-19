import { useCollectionRecordData } from '@tachybase/client';

export const ColumnShowApprovalId = () => {
  const record = useCollectionRecordData();
  return <span>{record?.context?.approvalId}</span>;
};
