import React, { useEffect, useMemo } from 'react';
import { FormItem as Item } from '@tachybase/components';
import { Field, useField, useFieldSchema } from '@tachybase/schema';

import { createStyles } from 'antd-style';
import cx from 'classnames';

import { useApp } from '../../../application';
import { useFormActiveFields } from '../../../block-provider/hooks/useFormActiveFields';
import { ACLCollectionFieldProvider } from '../../../built-in/acl';
import { Collection_deprecated } from '../../../collection-manager';
import { CollectionFieldProvider, useContextConfigSetting } from '../../../data-source';
import { GeneralSchemaDesigner } from '../../../schema-settings';
import { useVariables } from '../../../variables';
import useContextVariable from '../../../variables/hooks/useContextVariable';
import { BlockItem } from '../block-item';
import { HTMLEncode } from '../input/shared';
import { FilterFormDesigner } from './FormItem.FilterFormDesigner';
import useLazyLoadDisplayAssociationFieldsOfForm from './hooks/useLazyLoadDisplayAssociationFieldsOfForm';
import useParseDefaultValue from './hooks/useParseDefaultValue';
import { useEnsureOperatorsValid } from './SchemaSettingOptions';

const useStyles = createStyles(({ css }) => {
  return {
    space: css`
      & .ant-space {
        flex-wrap: wrap;
      }
    `,
    hide: css`
      > .ant-formily-item-label {
        display: none;
      }
    `,
    row: css`
      display: flex;
      flex-direction: row;
      align-items: baseline;
    `,
  };
});

export const FormItem = (props: any) => {
  const { styles } = useStyles();
  const { layoutDirection: selfLayoutDirection } = props;
  const field = useField<Field>();
  const schema = useFieldSchema();
  const contextVariable = useContextVariable();
  const variables = useVariables();
  const { addActiveFieldName } = useFormActiveFields() || {};
  const { layoutDirection } = useContextConfigSetting();

  const finishLayoutDirection = selfLayoutDirection ?? layoutDirection;
  useEnsureOperatorsValid();
  useEffect(() => {
    variables?.registerVariable(contextVariable);
  }, [contextVariable]);

  // 需要放在注冊完变量之后
  useParseDefaultValue();
  useLazyLoadDisplayAssociationFieldsOfForm();

  useEffect(() => {
    addActiveFieldName?.(schema.name as string);
  }, [addActiveFieldName, schema.name]);

  const showTitle = schema['x-decorator-props']?.showTitle ?? true;

  const extra = useMemo(() => {
    if (typeof field.description === 'string') {
      const desc = field.description.trim();
      if (!desc) return undefined;
      return (
        <div
          dangerouslySetInnerHTML={{
            __html: HTMLEncode(desc).split('\n').join('<br/>'),
          }}
        />
      );
    }
    return field.description ?? undefined;
  }, [field.description]);
  const className = useMemo(() => {
    return cx(
      styles.space,
      {
        [styles.hide]: showTitle === false,
      },
      {
        [styles.row]: finishLayoutDirection === 'row',
      },
    );
  }, [showTitle]);

  return (
    <CollectionFieldProvider allowNull={true}>
      <BlockItem className={'tb-form-item'}>
        <ACLCollectionFieldProvider>
          <Item className={className} {...props} extra={extra} />
        </ACLCollectionFieldProvider>
      </BlockItem>
    </CollectionFieldProvider>
  );
};

FormItem.displayName = 'FormItem';

FormItem.Designer = function Designer() {
  const app = useApp();
  const fieldSchema = useFieldSchema();
  const settingsName = `FormItemSettings:${fieldSchema['x-interface']}`;
  const defaultActionSettings = 'FormItemSettings';
  const hasFieldItem = app.schemaSettingsManager.has(settingsName);
  return (
    <GeneralSchemaDesigner schemaSettings={hasFieldItem ? settingsName : defaultActionSettings}></GeneralSchemaDesigner>
  );
};

export function isFileCollection(collection: Collection_deprecated) {
  return collection?.template === 'file';
}

FormItem.FilterFormDesigner = FilterFormDesigner;
