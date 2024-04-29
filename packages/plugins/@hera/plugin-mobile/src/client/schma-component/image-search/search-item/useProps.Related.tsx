// 关系字段类型
import { useCollection, useCollectionManager, useDataSourceHeaders, useRequest } from '@nocobase/client';
import { useField, useFieldSchema } from '@nocobase/schema';
import { useEffect, useMemo } from 'react';
import { useTabSearchCollapsibleInputItem } from '../../tab-search/components/field-item/hooks';
import { canBeRelatedField } from '../../tab-search/utils';

interface requestResultType {
  data: { [key: string]: any }[];
}

export const usePropsRelatedImageSearchItemField = () => {
  const fieldSchema = useFieldSchema();
  const collection = useCollection();
  console.log('%c Line:15 🥛 collection', 'font-size:18px;color:#ffdd4d;background:#6ec1c2', collection);
  const field = useField();
  console.log('%c Line:17 🍇 field', 'font-size:18px;color:#3f7cff;background:#6ec1c2', field);
  // TODO: 这里需要替换成获取 source id 的方式，不过我们暂时没有用多数据源，就不着急
  const blockProps = { dataSource: 'main' };
  const headers = useDataSourceHeaders(blockProps?.dataSource);
  const cm = useCollectionManager();

  const collectionField = useMemo(
    () => collection?.getField(fieldSchema['fieldName'] as any),
    [collection, fieldSchema['fieldName']],
  );

  console.log('%c Line:24 🍉 collectionField', 'font-size:18px;color:#b03734;background:#93c0a4', collectionField);
  const collectionFieldName = collectionField?.name;
  const fieldInterface = fieldSchema['x-component-props'].interface;
  const { onSelected } = useTabSearchCollapsibleInputItem();

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
        fields: [result.labelKey, result.valueKey, imageShow],
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
