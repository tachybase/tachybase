import { SchemaInitializer, gridRowColWrap, usePlugin } from '@nocobase/client';
import PluginWorkflow, {
  useAvailableUpstreams,
  useFlowContext,
  useNodeContext,
  useTrigger,
} from '@tachybase/plugin-workflow/client';
import { NAMESPACE } from '../../../locale';
import { ApproverAddBlockComponent } from './VC.ApproverAddBlock';
import { ApproverAddBlockKit } from './VC.ApproverAddBlockKit';

export const ApproverAddBlockInitializer = new SchemaInitializer({
  name: 'ApproverAddBlockInitializer',
  wrap: gridRowColWrap,
  title: "{{t('Add block')}}",
  items: [
    {
      name: 'approval',
      type: 'itemGroup',
      title: `{{t("Approval blocks", { ns: "${NAMESPACE}" })}}`,
      children: [
        {
          name: 'detail',
          type: 'item',
          title: '{{t("Details")}}',
          Component: ApproverAddBlockComponent,
        },
        {
          name: 'actions',
          type: 'item',
          title: '{{t("Actions")}}',
          Component: ApproverAddBlockKit,
        },
      ],
    },
    {
      type: 'itemGroup',
      name: 'dataBlocks',
      title: '{{t("Data blocks")}}',
      checkChildrenLength: true,
      useChildren() {
        const workflowPlugin = usePlugin(PluginWorkflow);
        const { workflow } = useFlowContext();
        const trigger = useTrigger();
        const currentNodeContext = useNodeContext();
        const nodes = useAvailableUpstreams(currentNodeContext);
        const triggerInitializers = [trigger.useInitializers?.call(trigger, workflow.config)].filter(Boolean);
        const nodeBlockInitializers = nodes
          .map((node) => {
            const instruction = workflowPlugin.instructions.get(node.type);
            return instruction?.useInitializers?.call(instruction, node);
          })
          .filter(Boolean);
        return [
          ...triggerInitializers,
          ...(nodeBlockInitializers.length
            ? [
                {
                  name: 'nodes',
                  type: 'subMenu',
                  title: '{{t("Node result", { ns: "workflow" })}}',
                  children: nodeBlockInitializers,
                },
              ]
            : []),
        ].filter(Boolean);
      },
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
          component: 'MarkdownBlockInitializer',
        },
      ],
    },
  ],
});
