import { SchemaInitializer, gridRowColWrap } from '@nocobase/client';
import { NAMESPACE } from '../locale';
import { Po } from './refined';

export const ApprovalApplyAddBlockButton = new SchemaInitializer({
  name: 'ApprovalApplyAddBlockButton',
  wrap: gridRowColWrap,
  title: '{{t("Add block")}}',
  items: [
    {
      name: 'forms',
      type: 'itemGroup',
      title: '{{t("Form")}}',
      children: [{ name: 'form', type: 'item', title: `{{t("Apply form", { ns: "${NAMESPACE}" })}}`, Component: Po }],
    },
    {
      name: 'others',
      type: 'itemGroup',
      title: '{{t("Other blocks")}}',
      children: [{ name: 'markdown', type: 'item', title: '{{t("Markdown")}}', Component: 'MarkdownBlockInitializer' }],
    },
  ],
});
