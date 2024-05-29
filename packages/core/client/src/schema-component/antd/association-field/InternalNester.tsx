import React, { useEffect } from 'react';
import { FormLayout } from '@tachybase/components';
import { observer, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import { createStyles } from 'antd-style';
import cx from 'classnames';

import { ACLCollectionProvider, useACLActionParamsContext } from '../../../buildin-plugin/acl';
import { CollectionProvider_deprecated } from '../../../collection-manager';
import { useAssociationFieldContext, useInsertSchema } from './hooks';
import schema from './schema';

const useStyles = createStyles(({ css }) => {
  return {
    body: css`
      & .ant-formily-item-layout-vertical {
        margin-bottom: 10px;
      }
      .ant-card-body {
        padding: 15px 20px 5px;
      }
      .ant-divider-horizontal {
        margin: 10px 0;
      }
    `,
    showTitle: css`
      .ant-card-body {
        padding: 0px 20px 20px 0px;
      }
      > .ant-card-bordered {
        border: none;
      }
    `,
  };
});

export const InternalNester = observer(
  () => {
    const field = useField();
    const fieldSchema = useFieldSchema();
    const insertNester = useInsertSchema('Nester');
    const { options: collectionField } = useAssociationFieldContext();
    const showTitle = fieldSchema['x-decorator-props']?.showTitle ?? true;
    const { actionName } = useACLActionParamsContext();
    const { styles } = useStyles();

    useEffect(() => {
      insertNester(schema.Nester);
    }, []);
    return (
      <CollectionProvider_deprecated name={collectionField.target}>
        <ACLCollectionProvider actionPath={`${collectionField.target}:${actionName}`}>
          <FormLayout layout={'vertical'}>
            <div
              className={cx(styles.body, {
                [styles.showTitle]: showTitle === false,
              })}
            >
              <RecursionField
                onlyRenderProperties
                basePath={field.address}
                schema={fieldSchema}
                filterProperties={(s) => {
                  return s['x-component'] === 'AssociationField.Nester';
                }}
              />
            </div>
          </FormLayout>
        </ACLCollectionProvider>
      </CollectionProvider_deprecated>
    );
  },
  { displayName: 'InternalNester' },
);
