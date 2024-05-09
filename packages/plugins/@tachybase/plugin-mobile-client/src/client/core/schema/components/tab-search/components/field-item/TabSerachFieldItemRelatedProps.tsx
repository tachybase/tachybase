// 关系字段类型
import { useEffect, useMemo } from 'react';
import { useCollection, useCollectionManager, useDataSourceHeaders, useRequest } from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';
import _ from 'lodash';
import { useTabSearchCollapsibleInputItem } from './hooks';
import { canBeRelatedField } from '../../utils';

export const useTabSearchFieldItemRelatedProps = () => {
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  const field = useField();
  // TODO 这里需要替换成获取 source id 的方式，不过我们暂时没有用多数据源，就不着急
  const blockProps = { dataSource: 'main' };
  const headers = useDataSourceHeaders(blockProps?.dataSource);
  const cm = useCollectionManager();
  const collectionField = useMemo(
    () => collection?.getField(fieldSchema['fieldName'] as any),
    [collection, fieldSchema['fieldName']],
  );
  const currentCollectionName = fieldSchema['x-component-props'].currentCollection;
  const collectionFieldName =
    currentCollectionName === collection?.name ? collectionField?.name : fieldSchema['fieldName'];

  const fieldInterface = fieldSchema['x-component-props'].interface;
  const result = { list: null, valueKey: '', labelKey: '', filterKey: '' };
  const { onSelected } = useTabSearchCollapsibleInputItem();
  result.valueKey = collectionField?.target ? cm.getCollection(collectionField.target)?.getPrimaryKey() : 'id';
  result.labelKey = fieldSchema['x-component-props']?.fieldNames?.label || result.valueKey;
  // eslint-disable-next-line prefer-const
  const { data, run } = useRequest<{
    data: { [key: string]: any }[];
  }>(
    {
      headers,
      resource: collectionField?.target,
      action: 'list',
      params: {
        fields: [result.labelKey, result.valueKey],
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

  if (!collectionField) {
    return {};
  }

  result.filterKey = `${collectionFieldName}.${result.valueKey}.$in`;
  result.list = data?.data || [];

  return {
    list: result.list,
    valueKey: result.valueKey,
    labelKey: result.labelKey,
    onSelected,
    filterKey: result.filterKey,
  };
};
