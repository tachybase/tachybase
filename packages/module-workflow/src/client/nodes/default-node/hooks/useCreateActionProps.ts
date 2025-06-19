import { useActionContext, useAPIClient } from '@tachybase/client';
import { useForm } from '@tachybase/schema';

import { message } from 'antd';

import { useFlowContext } from '../../../FlowContext';
import { useTranslation } from '../../../locale';
import { useContextNode } from '../../../NodeContext';

export function useCreateActionProps() {
  const { t } = useTranslation();
  const api = useAPIClient();
  const ctx = useActionContext();

  const { workflow, refresh } = useFlowContext() ?? {};
  const form = useForm();
  const { upstream, branchIndex } = useContextNode();

  return {
    async onClick() {
      try {
        const response = await fetch(form.values.file.url);
        const jsonData = await response.json();
        if (workflow) {
          await api.resource('workflows.nodes', workflow.id).create({
            values: {
              type: jsonData.type,
              upstreamId: upstream?.id ?? null,
              branchIndex,
              title: jsonData.title,
              config: jsonData.config,
            },
          });
          ctx.setVisible(false);
          message.success(t('Operation succeeded'));
          refresh();
          form.reset();
        }
      } catch (error) {
        ctx.setVisible(false);
        console.error('JSON解析失败:', error);
        refresh();
      }
    },
  };
}
