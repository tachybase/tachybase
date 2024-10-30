import { gridRowColWrap, SchemaInitializer } from '@tachybase/client';

import { NAMESPACE } from '../../../locale';
import { LauncherAddBlockButtonComponent } from './LauncherBlockButton.component';

// 添加区块
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
          title: '{{t("Demonstration text")}}',
          Component: 'MarkdownBlockInitializer',
        },
      ],
    },
  ],
});
