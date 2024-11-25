import { useActionContext, useAPIClient, useResourceActionContext } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { message } from 'antd';

import { useFlowContext } from '../../../FlowContext';
import { lang } from '../../../locale';
import { useContextNode } from '../Node.context';

export function useUpdateAction() {
  const form = useForm();
  const api = useAPIClient();
  const ctx = useActionContext();
  const { refresh } = useResourceActionContext();
  const data = useContextNode();
  const { workflow } = useFlowContext();
  return {
    async run() {
      if (workflow.executed) {
        message.error(lang('Node in executed workflow cannot be modified'));
        return;
      }
      await form.submit();
      await api.resource('flow_nodes').update?.({
        filterByTk: data.id,
        values: {
          config: form.values,
        },
      });
      ctx.setFormValueChanged(false);
      // ctx.setVisible(false);
      message.success('success');
      refresh();
    },
  };
}
