import { usePlugin } from '@tachybase/client';
import PluginWorkflow, {
  useAvailableUpstreams,
  useContextNode,
  useFlowContext,
  useTrigger,
} from '@tachybase/module-workflow/client';

// THINK: 可以作为一个通用方法, 放在 workflow 对外的 API 中
export function useChildrensWorkflow() {
  const workflowPlugin = usePlugin(PluginWorkflow);
  const { workflow } = useFlowContext();
  const trigger = useTrigger();
  const currentNodeContext = useContextNode();
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
}
