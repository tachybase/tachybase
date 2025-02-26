import {
  removeNullCondition,
  SchemaSettings,
  SchemaSettingsBlockTitleItem,
  SchemaSettingsDataScope,
  useCollection_deprecated,
  useDesignable,
  useFormBlockContext,
} from '@tachybase/client';
import { useField, useFieldSchema } from '@tachybase/schema';

import lodash from 'lodash';

import { useTranslation } from './locale';
import { useComment } from './useComment';

export const CommentBlockSchemaSettings = new SchemaSettings({
  name: 'blockSettings:comment',
  items: [
    { name: 'title', Component: SchemaSettingsBlockTitleItem },
    {
      name: 'SetTheDataScope',
      Component: SchemaSettingsDataScope,
      useComponentProps() {
        const { name } = useCollection_deprecated();
        const fieldSchema = useFieldSchema();
        const { form } = useFormBlockContext();
        const field = useField();
        const { dn } = useDesignable();
        return {
          collectionName: name,
          defaultFilter: fieldSchema?.['x-decorator-props']?.params?.filter || {},
          form,
          onSubmit: ({ filter }) => {
            filter = removeNullCondition(filter);
            lodash.set(fieldSchema, 'x-decorator-props.params.filter', filter);
            field.decoratorProps.params = { ...fieldSchema['x-decorator-props'].params, page: 1 };
            dn.emit('patch', {
              schema: { 'x-uid': fieldSchema['x-uid'], 'x-decorator-props': fieldSchema['x-decorator-props'] },
            });
          },
        };
      },
    },
    { name: 'divider', type: 'divider' },
    {
      name: 'EnableCreate',
      type: 'switch',
      useComponentProps() {
        const { setCreateAble, createAble } = useComment();
        const { t } = useTranslation();
        return { title: t('Enable Create'), checked: createAble, onChange: setCreateAble };
      },
    },
    {
      name: 'remove',
      type: 'remove',
      componentProps: { removeParentsIfNoChildren: true, breakRemoveOn: { 'x-component': 'Grid' } },
    },
  ],
});
