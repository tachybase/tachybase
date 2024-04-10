import { SchemaInitializer, gridRowColWrap, usePlugin } from '@nocobase/client';
import PluginWorkflow, {
  useAvailableUpstreams,
  useFlowContext,
  useNodeContext, useTrigger
} from '@nocobase/plugin-workflow/client';
import { NAMESPACE } from '../locale';
import { Lo, Jo } from './refined';

export const ApprovalProcessAddBlockButton = new SchemaInitializer({
  name: 'ApprovalProcessAddBlockButton',
  wrap: gridRowColWrap,
  title: "{{t('Add block')}}",
  items: [
    {
      name: 'approval',
      type: 'itemGroup',
      title: `{{t("Approval blocks", { ns: "${NAMESPACE}" })}}`,
      children: [
        { name: 'detail', type: 'item', title: '{{t("Details")}}', Component: Lo },
        { name: 'actions', type: 'item', title: '{{t("Actions")}}', Component: Jo },
      ],
    },
    {
      type: 'itemGroup',
      name: 'dataBlocks',
      title: '{{t("Data blocks")}}',
      checkChildrenLength: !0,
      useChildren() {
        var l;
        const e = usePlugin(PluginWorkflow), { workflow: t } = useFlowContext(), n = useTrigger(), a = useNodeContext(), s = useAvailableUpstreams(a), i = [(l = n.useInitializers) == null ? void 0 : l.call(n, t.config)].filter(Boolean), v = s
          .map((d) => {
            var h;
            const m = e.instructions.get(d.type);
            return (h = m == null ? void 0 : m.useInitializers) == null ? void 0 : h.call(m, d);
          })
          .filter(Boolean);
        return [
          ...i,
          ...(v.length
            ? [{ name: 'nodes', type: 'subMenu', title: '{{t("Node result", { ns: "workflow" })}}', children: v }]
            : []),
        ].filter(Boolean);
      },
    },
    {
      name: 'others',
      type: 'itemGroup',
      title: '{{t("Other blocks")}}',
      children: [{ name: 'markdown', type: 'item', title: '{{t("Markdown")}}', component: 'MarkdownBlockInitializer' }],
    },
  ],
});
