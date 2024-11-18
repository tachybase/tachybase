import { gridRowColWrap, SchemaInitializer, usePlugin } from '@tachybase/client';
import PluginWorkflow, {
  useAvailableUpstreams,
  useFlowContext,
  useNodeContext,
  useTrigger,
} from '@tachybase/module-workflow/client';

import { tval } from '../../../locale';
import { CarbonCopyDetailAddBlock } from './CarbonCopyDetail.block';

export const CarbonCopyDetailInitializer = new SchemaInitializer({
  name: 'CarbonCopyDetailInitializer',
  wrap: gridRowColWrap,
  title: "{{t('Add block')}}",
  items: [
    {
      name: 'notice',
      type: 'itemGroup',
      title: tval('Notice blocks'),
      children: [
        {
          name: 'detail',
          type: 'item',
          title: '{{t("Details")}}',
          Component: CarbonCopyDetailAddBlock,
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
          title: '{{t("Demonstration text")}}',
          component: 'MarkdownBlockInitializer',
        },
      ],
    },
  ],
});
