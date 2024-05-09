import { Field } from '@tachybase/schema';
import { useField, useFieldSchema } from '@tachybase/schema';
import { useIsFileField } from '../schema-component/antd/form-item/FormItem.Settings';
import { useColumnSchema } from '../schema-component/antd/table-v2/Table.Column.Decorator';
import { useCollectionField, useCollectionManager } from '../data-source';

export function useFieldComponentName(): string {
  const { fieldSchema: tableColumnSchema, collectionField: tableColumnField } = useColumnSchema();
  const field = useField<Field>();
  const cm = useCollectionManager();
  const isFileField = useIsFileField();
  const schema = useFieldSchema();
  const targetCollectionField = useCollectionField();
  const targetCollection = cm.getCollection(targetCollectionField?.target);
  const isTreeCollection = targetCollection?.template === 'tree';
  const fieldSchema = tableColumnSchema || schema;
  const collectionField = tableColumnField || targetCollectionField;
  const map = {
    // AssociationField 的 mode 默认值是 Select
    AssociationField: isTreeCollection ? 'Cascader' : 'Select',
  };

  const fieldComponentName =
    fieldSchema?.['x-component-props']?.['mode'] ||
    field?.componentProps?.['mode'] ||
    (isFileField ? 'FileManager' : '') ||
    collectionField?.uiSchema?.['x-component'];
  return map[fieldComponentName] || fieldComponentName;
}
