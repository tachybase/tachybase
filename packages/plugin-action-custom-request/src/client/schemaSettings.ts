import {
  ButtonEditor,
  RemoveButton,
  SchemaSettings,
  SchemaSettingsLinkageRules,
  SecondConFirm,
  useCollection,
  useSchemaToolbar,
} from '@tachybase/client';

import { CustomRequestACL, CustomRequestSettingsItem } from './components/CustomRequestActionDesigner';
import { CustomRequestAfter } from './components/CustomRequestAfter';

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
      name: 'afterSuccessfulSubmission',
      Component: CustomRequestAfter, // 加下载配置,动态设置返回
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
