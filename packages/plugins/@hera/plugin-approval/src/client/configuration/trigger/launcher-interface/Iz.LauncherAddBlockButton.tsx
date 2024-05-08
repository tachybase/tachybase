import { SchemaInitializer, gridRowColWrap } from '@tachybase/client';
import { NAMESPACE } from '../../../locale';
import { LauncherAddBlockButtonComponent } from './VC.LauncherBlockButton';

// 创建区块
export const LauncherAddBlockButtonIntializer = new SchemaInitializer({
  name: 'ApprovalApplyAddBlockButton',
  wrap: gridRowColWrap,
  title: '{{t("Add block")}}',
  items: [
    {
      name: 'forms',
      type: 'itemGroup',
      title: '{{t("Form")}}',
      children: [
        {
          name: 'form',
          type: 'item',
          title: `{{t("Apply form", { ns: "${NAMESPACE}" })}}`,
          Component: LauncherAddBlockButtonComponent,
        },
      ],
    },
    {
      name: 'others',
      type: 'itemGroup',
      title: '{{t("Other blocks")}}',
      children: [
        {
          name: 'markdown',
          type: 'item',
          title: '{{t("Markdown")}}',
          Component: 'MarkdownBlockInitializer',
        },
      ],
    },
  ],
});
