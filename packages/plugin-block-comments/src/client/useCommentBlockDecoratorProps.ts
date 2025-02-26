import { useParentRecordCommon } from '@tachybase/client';

export function useCommentBlockDecoratorProps(props) {
  const { association } = props;
  let parentRecord = useParentRecordCommon(association);
  return {
    parentRecord,
    params: {
      pageSize: 100,
      appends: ['createdBy'],
      sort: ['createdAt'],
    },
  };
}
