import React from 'react';
import {
  CollectionProvider_deprecated,
  createFormBlockSchema,
  Plugin,
  SchemaInitializerItem,
  SchemaInitializerItemType,
  useRecordCollectionDataSourceItems,
  useSchemaInitializer,
  useSchemaInitializerItem,
  useSchemaTemplateManager,
} from '@tachybase/client';

import { traverseSchema } from '../../../../../utils';
import { ApprovalAddActionButton } from './AddActionButton.setting';

export class KitApprovalAddActionButton extends Plugin {
  async load() {
    this.app.schemaInitializerManager.add(ApprovalAddActionButton);
  }
}

function InternalFormBlockInitializer({ schema, ...others }) {
  const { insert } = useSchemaInitializer();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const items = useRecordCollectionDataSourceItems('FormItem') as SchemaInitializerItemType[];
  const onClick = async (item) => {
    const template = item.template ? await getTemplateSchemaByMode(item) : null;
    const result = createFormBlockSchema({
      actionInitializers: 'ApprovalAddActionButton',
      ...schema,
      template,
    });
    delete result['x-acl-action-props'];
    delete result['x-acl-action'];
    const [formKey] = Object.keys(result.properties);
    //获取actionBar的schemakey
    const actionKey =
      Object.entries(result.properties[formKey].properties).find(([key, f]) => f['x-component'] === 'ActionBar')?.[0] ||
      'actions';
    result.properties[formKey].properties[actionKey]['x-decorator'] = 'ActionBarProvider';
    result.properties[formKey].properties[actionKey]['x-component-props'].style = {
      marginTop: '1.5em',
      flexWrap: 'wrap',
    };
    traverseSchema(result, (node) => {
      if (node['x-uid']) {
        delete node['x-uid'];
      }
    });
    insert(result);
  };

  return <SchemaInitializerItem {...others} onClick={onClick} items={items} />;
}

export const FormBlockFactory = () => {
  const itemConfig = useSchemaInitializerItem();
  return (
    <CollectionProvider_deprecated
      dataSource={itemConfig.schema?.dataSource}
      collection={itemConfig.schema?.collection}
    >
      <InternalFormBlockInitializer {...itemConfig} />
    </CollectionProvider_deprecated>
  );
};
