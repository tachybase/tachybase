import { useCollectionManager_deprecated, useCompile } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { useFlowContext } from '../../FlowContext';
import { tval } from '../../locale';
import { Instruction } from '../../nodes/default-node/interface';
import { getCollectionFieldOptions } from '../../variable';

const useWorkflowTrigger = () => {
  const { workflow } = useFlowContext();

  return {
    filterSync: workflow?.sync,
    filterKey: workflow?.key ? { $ne: workflow?.key } : undefined,
  };
};

/** 节点: 工作流 */
export class TriggerInstruction extends Instruction {
  title = tval('Workflow');
  type = 'trigger-instruction';
  group = 'extended';
  icon = 'NodeIndexOutlined';
  color = '#0a72e9';
  fieldset = {
    workflowKey: {
      type: 'string',
      title: tval('Workflow'),
      name: 'workflowKey',
      'x-decorator': 'FormItem',
      'x-component': 'WorkflowSelect',
      'x-component-props': {
        buttonAction: 'customize:triggerWorkflows',
        noCollection: true,
        label: 'title',
        value: 'key',
      },
      'x-use-component-props': useWorkflowTrigger,
      required: true,
    },
    bindCollection: {
      type: 'boolean',
      title: tval('Bind collection?'),
      'x-decorator': 'FormItem',
      'x-component': 'Radio.Group',
      enum: [
        { label: tval('Yes'), value: true },
        { label: tval('No'), value: false },
      ],
      required: true,
      default: false,
    },
    collection: {
      type: 'string',
      title: tval('Collection'),
      'x-decorator': 'FormItem',
      'x-component': 'DataSourceCollectionCascader',
      required: true,
      'x-reactions': [
        { target: 'changed', effects: ['onFieldValueChange'], fulfill: { state: { value: [] } } },
        { dependencies: ['bindCollection'], fulfill: { state: { visible: '{{!!$deps[0]}}' } } },
      ],
    },
    appends: {
      type: 'array',
      title: tval('Associations to use'),
      description: tval(
        'Please select the associated fields that need to be accessed in subsequent nodes. With more than two levels of to-many associations may cause performance issue, please use with caution.',
      ),
      'x-decorator': 'FormItem',
      'x-component': 'AppendsTreeSelect',
      'x-component-props': {
        multiple: true,
        useCollection() {
          const form = useForm();
          return form.values?.collection;
        },
      },
      'x-reactions': [{ dependencies: ['collection'], fulfill: { state: { visible: '{{!!$deps[0]}}' } } }],
    },
  };
  useVariables({ key: name, title, config }, options) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const compile = useCompile();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { getCollectionFields } = useCollectionManager_deprecated();
    const [result] = getCollectionFieldOptions({
      appends: [name, ...(config.params?.appends?.map((item) => `${name}.${item}`) || [])],
      ...options,
      fields: [
        {
          collectionName: config.collection,
          name,
          type: 'hasOne',
          target: config.collection,
          uiSchema: {
            title,
          },
        },
      ],
      compile,
      getCollectionFields,
    });

    return result;
  }
}
