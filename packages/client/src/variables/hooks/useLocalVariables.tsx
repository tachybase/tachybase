import { useMemo } from 'react';
import { Form } from '@tachybase/schema';

import { useCollection } from '../../data-source';
import { useBlockCollection } from '../../schema-settings/VariableInput/hooks/useBlockCollection';
import { useDatetimeVariable } from '../../schema-settings/VariableInput/hooks/useDateVariable';
import { useCurrentFormVariable } from '../../schema-settings/VariableInput/hooks/useFormVariable';
import { useCurrentObjectVariable } from '../../schema-settings/VariableInput/hooks/useIterationVariable';
import { useCurrentParentRecordVariable } from '../../schema-settings/VariableInput/hooks/useParentRecordVariable';
import { usePopupVariable } from '../../schema-settings/VariableInput/hooks/usePopupVariable';
import { useCurrentRecordVariable } from '../../schema-settings/VariableInput/hooks/useRecordVariable';
import { VariableOption } from '../types';

interface Props {
  collectionName?: string;
  currentForm?: Form;
}

const useLocalVariables = (props?: Props) => {
  const { currentObjectCtx, shouldDisplayCurrentObject } = useCurrentObjectVariable();
  const { currentRecordCtx, collectionName: collectionNameOfRecord } = useCurrentRecordVariable();
  const { popupRecordCtx, collectionName: collectionNameOfPopupRecord } = usePopupVariable();
  const { currentParentRecordCtx, collectionName: collectionNameOfParentRecord } = useCurrentParentRecordVariable();
  const { datetimeCtx } = useDatetimeVariable();
  const { currentFormCtx } = useCurrentFormVariable({ form: props?.currentForm });
  const collection = useCollection();
  let { name } = useBlockCollection();

  if (props?.collectionName) {
    name = props.collectionName;
  }

  return useMemo(() => {
    return (
      [
        {
          name: '$nRecord',
          ctx: currentRecordCtx,
          collectionName: collectionNameOfRecord,
        },
        {
          name: '$nParentRecord',
          ctx: currentParentRecordCtx,
          collectionName: collectionNameOfParentRecord,
        },
        {
          name: '$nPopupRecord',
          ctx: popupRecordCtx,
          collectionName: collectionNameOfPopupRecord,
        },
        {
          name: '$nForm',
          ctx: currentFormCtx,
          collectionName: name,
        },
        {
          name: '$nDate',
          ctx: datetimeCtx,
        },
        shouldDisplayCurrentObject && {
          name: '$iteration',
          ctx: currentObjectCtx,
          collectionName: collection?.name,
        },
      ] as VariableOption[]
    ).filter(Boolean);
  }, [
    currentRecordCtx,
    collectionNameOfRecord,
    name,
    currentFormCtx,
    currentParentRecordCtx,
    collectionNameOfParentRecord,
    popupRecordCtx,
    collectionNameOfPopupRecord,
    datetimeCtx,
    shouldDisplayCurrentObject,
    currentObjectCtx,
    collection?.name,
  ]); // 尽量保持返回的值不变，这样可以减少接口的请求次数，因为关系字段会缓存到变量的 ctx 中
};

export default useLocalVariables;
