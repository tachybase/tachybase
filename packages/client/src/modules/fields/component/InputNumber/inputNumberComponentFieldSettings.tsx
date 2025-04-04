import { useField, useFieldSchema, useForm } from '@tachybase/schema';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useIsFieldReadPretty } from '../../../../schema-component/antd/form-item/FormItem.Settings';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';
import { SchemaSettingsNumberFormat } from '../../../../schema-settings/SchemaSettingsNumberFormat';

export const inputNumberComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:InputNumber',
  items: [
    {
      name: 'displayFormat',
      Component: SchemaSettingsNumberFormat as any,
      useComponentProps() {
        const schema = useFieldSchema();
        const { fieldSchema: tableColumnSchema } = useColumnSchema();
        const fieldSchema = tableColumnSchema || schema;
        return {
          fieldSchema,
        };
      },
      useVisible() {
        const isFieldReadPretty = useIsFieldReadPretty();
        return isFieldReadPretty;
      },
    },
  ],
});
