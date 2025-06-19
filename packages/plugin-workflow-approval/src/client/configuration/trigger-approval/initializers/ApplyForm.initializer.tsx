import { gridRowColWrap, SchemaInitializer } from '@tachybase/client';

import { NAMESPACE } from '../../../locale';
import { ApplyFormDetailInitializerItem } from './ApplyFormDetail';

// 添加卡片
export const ApplyFormInitializer = new SchemaInitializer({
  name: 'ApplyFormInitializer',
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
          Component: ApplyFormDetailInitializerItem,
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

/**
 * @deprecated 完全整理重构完审批, 走完迁移逻辑, 以及充分测试现有应用后, 可删除此过期配置
 */
// 添加卡片
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
          Component: ApplyFormDetailInitializerItem,
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
