import React, { useEffect } from 'react';
import { FormLayout } from '@tachybase/components';
import { observer, RecursionField, SchemaOptionsContext, useField, useFieldSchema } from '@tachybase/schema';

import { createStyles } from 'antd-style';

import { ACLCollectionProvider, useACLActionParamsContext } from '../../../buildin-plugin/acl';
import { CollectionProvider_deprecated } from '../../../collection-manager';
import { FormItem, useSchemaOptionsContext } from '../../../schema-component';
import Select from '../select/Select';
import { useAssociationFieldContext, useInsertSchema } from './hooks';
import schema from './schema';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      .ant-formily-item-bordered-none {
        .ant-input-number-group-addon {
          border: none !important;
          background: none;
        }
        .ant-checkbox-wrapper {
          margin-left: 8px;
        }
        .ant-table {
          margin: 0px !important;
        }
      }
    `,
  };
});

export const InternalSubTable = observer(
  () => {
    const { styles } = useStyles();
    const field: any = useField();
    const fieldSchema = useFieldSchema();
    const insert = useInsertSchema('SubTable');
    const insertSelector = useInsertSchema('Selector');
    const { options } = useAssociationFieldContext();
    const { actionName } = useACLActionParamsContext();
    useEffect(() => {
      insert(schema.SubTable);
      field.required = fieldSchema['required'];
    }, []);
    useEffect(() => {
      if (field.componentProps?.allowSelectExistingRecord) {
        insertSelector(schema.Selector);
      }
    }, [field.componentProps?.allowSelectExistingRecord]);
    const option = useSchemaOptionsContext();
    const components = {
      ...option.components,
      FormItem,
      'Radio.Group': Select,
      'Checkbox.Group': (props) => <Select multiple={true} mode="multiple" {...props} />,
    };
    return (
      <CollectionProvider_deprecated name={options.target}>
        <ACLCollectionProvider actionPath={`${options.target}:${actionName || 'view'}`}>
          <FormLayout className={styles.container} layout={'vertical'} bordered={false}>
            <SchemaOptionsContext.Provider
              value={{
                scope: option.scope,
                components,
              }}
            >
              <RecursionField
                onlyRenderProperties
                basePath={field.address}
                schema={fieldSchema}
                filterProperties={(s) => {
                  return s['x-component'] === 'AssociationField.SubTable';
                }}
              />
            </SchemaOptionsContext.Provider>
          </FormLayout>
        </ACLCollectionProvider>
      </CollectionProvider_deprecated>
    );
  },
  { displayName: 'InternalSubTable' },
);
