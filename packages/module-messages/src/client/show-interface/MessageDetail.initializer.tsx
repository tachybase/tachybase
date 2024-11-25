import { gridRowColWrap, SchemaInitializer, usePlugin } from '@tachybase/client';
import PluginWorkflow, {
  useAvailableUpstreams,
  useFlowContext,
  useNodeContext,
  useTrigger,
} from '@tachybase/module-workflow/client';

import { tval } from '../locale';
import { MessageDetailAddBlock } from './MessageDetail.block';

export const MessageDetailInitializer = new SchemaInitializer({
  name: 'MessageDetailInitializer',
  wrap: gridRowColWrap,
  title: "{{t('Add block')}}",
  items: [
    {
      name: 'message',
      type: 'itemGroup',
      title: tval('Message blocks'),
      children: [
        {
          name: 'detail',
          type: 'item',
          title: '{{t("Details")}}',
          Component: MessageDetailAddBlock,
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
          component: 'MarkdownBlockInitializer',
        },
      ],
    },
  ],
});
