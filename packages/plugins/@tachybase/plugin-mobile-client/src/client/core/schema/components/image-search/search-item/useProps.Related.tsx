// 关系字段类型
import { useCollection, useCollectionManager, useDataSourceHeaders, useRequest } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';
import { useEffect, useMemo } from 'react';
import { canBeRelatedField } from '../../tab-search/utils';
import { useGetSelected } from '../hooks/useSelect';

interface requestResultType {
  data: { [key: string]: any }[];
}

export const usePropsRelatedImageSearchItemField = () => {
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const field = useField();
  // TODO: 这里需要替换成获取 source id 的方式，不过我们暂时没有用多数据源，就不着急
  const blockProps = { dataSource: 'main' };
  const headers = useDataSourceHeaders(blockProps?.dataSource);
  const cm = useCollectionManager();

  const collectionField = useMemo(
    () => collection?.getField(fieldSchema['fieldName'] as any),
    [collection, fieldSchema['fieldName']],
  );

  const collectionFieldName = collectionField?.name;
  const fieldInterface = fieldSchema['x-component-props'].interface;
  const { onSelected } = useGetSelected();

  const result = { list: null, valueKey: '', labelKey: '', filterKey: '' };

  result.valueKey = collectionField?.target ? cm.getCollection(collectionField.target)?.getPrimaryKey() : 'id';

  result.labelKey = fieldSchema['x-component-props']?.fieldNames?.label || result.valueKey;

  const imageShow = fieldSchema['x-component-props']?.fieldNames?.imageShow || 'imageShow';

  const { data } = useRequestRelatedField({ headers, collectionField, result, imageShow, field, fieldInterface });

  result.filterKey = `${collectionFieldName}.${result.valueKey}.$in`;
  result.list = data?.data || [];

  if (!collectionField) {
    return;
  }

  return {
    list: result.list,
    valueKey: result.valueKey,
    labelKey: result.labelKey,
    filterKey: result.filterKey,
    onSelected,
  };
};

const useRequestRelatedField = ({ headers, collectionField, result, imageShow, field, fieldInterface }) => {
  const { data, run } = useRequest<requestResultType>(
    {
      headers,
      resource: collectionField?.target,
      action: 'list',
      params: {
        fields: [result.labelKey, result.valueKey, imageShow, 'type'],
        pageSize: 200,
        page: 1,
        ...field.componentProps?.params,
      },
    },
    {
      manual: true,
      debounceWait: 300,
    },
  );

  useEffect(() => {
    if (canBeRelatedField(fieldInterface) && collectionField?.target) {
      run();
    }
  }, [
    result.labelKey,
    result.valueKey,
    JSON.stringify(field.componentProps?.params || {}),
    canBeRelatedField(fieldInterface),
  ]);

  return { data };
};
