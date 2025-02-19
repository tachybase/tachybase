import {
  AfterSuccess,
  ButtonEditor,
  IsDownLoad,
  RemoveButton,
  SchemaSettings,
  SchemaSettingsLinkageRules,
  SecondConFirm,
  SettingDownTitle,
  ShowData,
  useCollection,
  useSchemaToolbar,
} from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { CustomRequestACL, CustomRequestSettingsItem } from './components/CustomRequestActionDesigner';

export const customizeCustomRequestActionSettings = new SchemaSettings({
  name: 'actionSettings:customRequest',
  items: [
    {
      name: 'editButton',
      Component: ButtonEditor,
      useComponentProps() {
        const { buttonEditorProps } = useSchemaToolbar();
        return {
          isLink: true,
          ...buttonEditorProps,
        };
      },
    },
    {
      name: 'linkageRules',
      Component: SchemaSettingsLinkageRules,
      useComponentProps() {
        const { name } = useCollection();
        const { linkageRulesProps } = useSchemaToolbar();
        return {
          ...linkageRulesProps,
          collectionName: name,
        };
      },
    },
    {
      name: 'secondConFirm',
      Component: SecondConFirm,
    },
    {
      name: 'isDownLoad',
      Component: IsDownLoad,
    },
    {
      name: 'settingDownTitle',
      Component: SettingDownTitle,
      useVisible() {
        const fieldSchema = useFieldSchema();
        const down = fieldSchema?.['x-action-settings']?.onSuccess?.down;
        return down;
      },
    },
    {
      name: 'showData',
      Component: ShowData,
    },
    {
      name: 'afterSuccessfulSubmission',
      Component: AfterSuccess, // 加下载配置,动态设置返回
    },
    {
      name: 'request settings',
      Component: CustomRequestSettingsItem,
    },
    {
      name: 'accessControl',
      Component: CustomRequestACL,
    },
    {
      name: 'delete',
      sort: 100,
      Component: RemoveButton as any,
      useComponentProps() {
        const { removeButtonProps } = useSchemaToolbar();
        return removeButtonProps;
      },
    },
  ],
});
