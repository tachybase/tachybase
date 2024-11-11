import { useDataBlockParentRecord, useDataBlockProps } from '../..';
import { useSourceKey } from './useSourceKey';

export const useSourceId = () => {
  const { sourceId, association } = useDataBlockProps() || {};
  const sourceKey = useSourceKey(association);
  const sourceRecord = useDataBlockParentRecord({ association });

  if (sourceId) {
    return sourceId;
  }

  return sourceRecord?.[sourceKey];
};
