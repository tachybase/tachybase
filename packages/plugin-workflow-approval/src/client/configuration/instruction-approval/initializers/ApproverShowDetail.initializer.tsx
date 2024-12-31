import { gridRowColWrap, SchemaInitializer, useDataSourceManager, usePlugin } from '@tachybase/client';
import PluginWorkflow, {
  useAvailableUpstreams,
  useContextNode,
  useFlowContext,
  useTrigger,
} from '@tachybase/module-workflow/client';

import { NAMESPACE } from '../../../locale';
import { ApproverDetailForm } from './ApproverDetailForm';
import { approvalFormOptions, ApprovalFormType } from './forms/Approval.options';
import { SwitchApproverActionBlock } from './SwitchApproverActionBlock';

export const ApproverShowDetailInitializer = new SchemaInitializer({
  name: 'ApproverShowDetailInitializer',
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
          Component: ApproverDetailForm,
        },
        {
          name: 'actions',
          type: 'item',
          title: '{{t("Actions")}}',
          Component: SwitchApproverActionBlock,
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
      },
    },
    {
      type: 'itemGroup',
      name: 'form',
      title: '{{t("Form")}}',
      useChildren() {
        const dm = useDataSourceManager();
        const allCollections = dm.getAllCollections();
        const values = Array.from(approvalFormOptions.getValues());
        return values.map((item: ApprovalFormType) => {
          // NOTE: 这里通过赋别名,避免 eslint 检查 hooks 语法,无法提交
          const { useInitializer: getInitializer } = item.config;
          return getInitializer({ allCollections });
        });
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
