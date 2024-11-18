import { useMemo, useState } from 'react';
import { useMenuSearch } from '@tachybase/client';
import { FilterDynamicComponent } from '@tachybase/module-workflow/client';

import _ from 'lodash';

import { NAMESPACE } from '../../../locale';
import { FormBlockFactory } from './FormBlock.factory';

const updateFormConfig = {
  title: `{{t("Update record form", { ns: "${NAMESPACE}" })}}`,
  config: {
    initializers: {},
    components: {
      FilterDynamicComponent,
    },
    useInitializer: ({ allCollections }) => {
      const childItems = useMemo(() => {
        const results = allCollections.map(({ key, displayName, collections }) => ({
          key,
          name: key,
          label: displayName,
          type: 'subMenu',
          children: collections.map(({ name, title, tableName }) => ({
            name: _.camelCase(`updateRecordForm-child-${name}`),
            type: 'item',
            title: title || tableName,
            schema: {
              collection: name,
              dataSource: key,
              formType: 'update',
            },
            Component: FormBlockFactory,
          })),
        }));
        return results;
      }, [allCollections]);
      const [openMenuKeys, setOpenMenuKeys] = useState([]);
      const searchedChildren = useMenuSearch({ data: childItems, openKeys: openMenuKeys });
      return {
        name: 'updateRecordForm',
        key: 'updateRecordForm',
        type: 'subMenu',
        title: `{{t("Update record form", { ns: "${NAMESPACE}" })}}`,
        componentProps: {
          onOpenChange(keys) {
            setOpenMenuKeys(keys);
          },
        },
        children: searchedChildren,
      };
    },
    parseFormOptions: (root) => {
      const forms = {};
      const formBlocks: any[] = findSchema(
        root,
        (item) => item['x-decorator'] === 'FormBlockProvider' && item['x-decorator-props'].formType === 'update',
      );

      formBlocks.forEach((formBlock) => {
        const [formKey] = Object.keys(formBlock.properties);
        const formSchema = formBlock.properties[formKey];
        //获取actionBar的schemakey
        const actionKey =
          Object.entries(formSchema.properties).find(([key, f]) => f['x-component'] === 'ActionBar')?.[0] || 'actions';
        forms[formKey] = {
          ...formBlock['x-decorator-props'],
          type: 'update',
          title: formBlock['x-component-props']?.title || formKey,
          actions: findSchema(formSchema.properties[actionKey], (item) => item['x-component'] === 'Action').map(
            (item) => ({
              status: item['x-decorator-props'].value,
              values: item['x-action-settings']?.assignedValues?.values,
              key: item.name,
            }),
          ),
        };
      });
      return forms;
    },
  },
  block: {
    scope: {},
    components: {},
  },
};

// utils
function findSchema(schema, filter, onlyLeaf = false) {
  const result = [];

  if (!schema) {
    return result;
  }

  if (filter(schema) && (!onlyLeaf || !schema.properties)) {
    result.push(schema);
    return result;
  }

  if (schema.properties) {
    Object.keys(schema.properties).forEach((key) => {
      result.push(...findSchema(schema.properties[key], filter));
    });
  }
  return result;
}

export default updateFormConfig;
