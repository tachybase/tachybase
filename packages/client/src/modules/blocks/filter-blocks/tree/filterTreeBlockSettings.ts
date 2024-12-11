import { useFieldSchema } from '@tachybase/schema';

import { useTranslation } from 'react-i18next';

import { SchemaSettings } from '../../../../application/schema-settings/SchemaSettings';
import { useCollection } from '../../../../data-source';
import { FilterBlockType } from '../../../../filter-provider';
import {
  SchemaSettingsBlockTitleItem,
  SchemaSettingsConnectDataBlocks,
  SchemaSettingsFormItemTemplate,
  SchemaSettingsLinkageRules,
} from '../../../../schema-settings';

export const filterTreeBlockSettings = new SchemaSettings({
  name: 'blockSettings:filterTree',
  items: [
    {
      name: 'title',
      Component: SchemaSettingsBlockTitleItem,
    },
    {
      name: 'formItemTemplate',
      Component: SchemaSettingsFormItemTemplate,
      useComponentProps() {
        const { name } = useCollection();
        const fieldSchema = useFieldSchema();
        const defaultResource =
          fieldSchema?.['x-decorator-props']?.resource || fieldSchema?.['x-decorator-props']?.association;
        return {
          componentName: 'FilterFormItem',
          collectionName: name,
          resourceName: defaultResource,
        };
      },
    },
    {
      name: 'linkageRules',
      Component: SchemaSettingsLinkageRules,
      useComponentProps() {
        const { name } = useCollection();
        return {
          collectionName: name,
        };
      },
    },
    {
      name: 'connectDataBlocks',
      Component: SchemaSettingsConnectDataBlocks,
      useComponentProps() {
        const { t } = useTranslation();
        return {
          type: FilterBlockType.TREE,
          emptyDescription: t('No blocks to connect'),
        };
      },
    },
    {
      name: 'divider',
      type: 'divider',
    },
    {
      name: 'remove',
      type: 'remove',
      componentProps: {
        removeParentsIfNoChildren: true,
        breakRemoveOn: {
          'x-component': 'Grid',
        },
      },
    },
  ],
});
