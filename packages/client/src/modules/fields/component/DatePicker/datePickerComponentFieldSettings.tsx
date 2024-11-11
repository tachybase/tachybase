import { useFieldSchema } from '@tachybase/schema';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useColumnSchema } from '../../../../schema-component/antd/table-v2/Table.Column.Decorator';
import { SchemaSettingsDateFormat } from '../../../../schema-settings/SchemaSettingsDateFormat';

export const datePickerComponentFieldSettings = new SchemaSettings({
  name: 'fieldSettings:component:DatePicker',
  items: [
    {
      name: 'dateDisplayFormat',
      Component: SchemaSettingsDateFormat as any,
      useComponentProps() {
        const schema = useFieldSchema();
        const { fieldSchema: tableColumnSchema } = useColumnSchema();
        const fieldSchema = tableColumnSchema || schema;
        return {
          fieldSchema,
        };
      },
    },
  ],
});
