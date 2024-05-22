import {
  SchemaSettings,
  SchemaSettingsDataScope,
  removeNullCondition,
  useCollection,
  useCollectionManager,
  useDataLoadingMode,
  useDesignable,
  useDetailsBlockContext,
  useFormBlockContext,
} from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';
import _ from 'lodash';

export const ApprovalSettings = new SchemaSettings({
  name: 'ApprovalSettings',
  items: [
    {
      name: 'setTheDataScope',
      Component: SchemaSettingsDataScope,
      useComponentProps() {
        const fieldSchema = useFieldSchema();
        const collectionName = fieldSchema['x-component-props']['collectionName'];
        const field = useField();
        const { form } = useFormBlockContext();
        const { dn } = useDesignable();

        return {
          collectionName,
          defaultFilter: fieldSchema?.['x-component-props']?.params?.filter || {},
          form: form,
          onSubmit: ({ filter }) => {
            _.set(field.componentProps, 'params', {
              ...field.componentProps?.params,
              filter,
            });
            fieldSchema['x-component-props']['params'] = field.componentProps.params;
            dn.emit('patch', {
              schema: {
                ['x-uid']: fieldSchema['x-uid'],
                'x-component-props': fieldSchema['x-component-props'],
              },
            });
          },
        };
      },
      // useVisible() {
      //   const fieldSchema = useFieldSchema();
      //   return !isTabSearchCollapsibleInputItem(fieldSchema['x-component']);
      // },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'delete',
      type: 'remove',
      sort: 100,
    },
  ],
});
