import React from 'react';
import {
  ActionDesigner,
  SchemaInitializerOpenModeSchemaItems,
  SchemaSettings,
  SchemaSettingsDivider,
  SchemaSettingsRemove,
  SchemaSettingsSelectItem,
  useDesignable,
  useSchemaToolbar,
} from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { ModalProps } from 'antd';
import { useTranslation } from 'react-i18next';

function UpdateMode() {
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();

  return (
    <SchemaSettingsSelectItem
      title={t('Data will be updated')}
      options={[
        { label: t('Selected'), value: 'selected' },
        { label: t('All'), value: 'all' },
      ]}
      value={fieldSchema?.['x-action-settings']?.['updateMode']}
      onChange={(value) => {
        fieldSchema['x-action-settings']['updateMode'] = value;
        dn.emit('patch', {
          schema: {
            'x-uid': fieldSchema['x-uid'],
            'x-action-settings': fieldSchema['x-action-settings'],
          },
        });
        dn.refresh();
      }}
    />
  );
}

function RemoveButton(
  props: {
    onConfirmOk?: ModalProps['onOk'];
  } = {},
) {
  const { t } = useTranslation();
  const fieldSchema = useFieldSchema();
  const isDeletable = fieldSchema?.parent['x-component'] === 'CollectionField';
  return (
    !isDeletable && (
      <>
        <SchemaSettingsDivider />
        <SchemaSettingsRemove
          removeParentsIfNoChildren
          breakRemoveOn={(s) => {
            return s['x-component'] === 'Space' || s['x-component'].endsWith('ActionBar');
          }}
          confirm={{
            title: t('Delete action'),
            onOk: props.onConfirmOk,
          }}
        />
      </>
    )
  );
}

export const bulkEditActionSettings = new SchemaSettings({
  name: 'actionSettings:bulkEdit',
  items: [
    {
      name: 'editButton',
      Component: ActionDesigner.ButtonEditor,
      useComponentProps() {
        const { buttonEditorProps } = useSchemaToolbar();
        return buttonEditorProps;
      },
    },
    {
      name: 'openMode',
      Component: SchemaInitializerOpenModeSchemaItems,
      useComponentProps() {
        const fieldSchema = useFieldSchema();
        const isPopupAction = ['create', 'update', 'view', 'customize:popup', 'duplicate', 'customize:create'].includes(
          fieldSchema['x-action'] || '',
        );

        return {
          openMode: isPopupAction,
          openSize: isPopupAction,
        };
      },
    },
    {
      name: 'updateMode',
      Component: UpdateMode,
    },
    {
      name: 'remove',
      sort: 100,
      Component: RemoveButton as any,
      useComponentProps() {
        const { removeButtonProps } = useSchemaToolbar();
        return removeButtonProps;
      },
    },
  ],
});
