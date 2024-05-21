import { useParentRecordCommon } from '@tachybase/client';

export function useCommentBlockDecoratorProps(props) {
  let parentRecord;
  return (
    // eslint-disable-next-line react-hooks/rules-of-hooks
    props.association && (parentRecord = useParentRecordCommon(props.association)),
    { parentRecord, params: { pageSize: 100, appends: ['createdBy'], sort: ['createdAt'] } }
  );
}
