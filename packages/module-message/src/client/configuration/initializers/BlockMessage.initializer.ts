import { gridRowColWrap, SchemaInitializer } from '@tachybase/client';

import { tval } from '../../locale';
import { BlockMessageDetail } from '../components/BlockMessageDetail';
import { useChildrensWorkflow } from '../hooks/useChildrensWorkflow';

// 查看消息详情, 配置初始化器
export const getInitializerBlockMessage = ({ app }) => {
  const pageAddBlockInitializer = app.schemaInitializerManager.get('page:addBlock');
  const initializerItems = pageAddBlockInitializer.items;
  return new SchemaInitializer({
    name: 'InitializerBlockMessage',
    title: "{{t('Add block')}}",
    wrap: gridRowColWrap,
    items: [
      {
        name: 'messageCard',
        type: 'itemGroup',
        title: tval('Trigger data'),
        children: [
          {
            name: 'detail',
            type: 'item',
            title: '{{t("Details")}}',
            Component: BlockMessageDetail,
          },
        ],
      },
      {
        name: 'dataBlocks',
        type: 'itemGroup',
        title: tval('Workflow Data blocks'),
        checkChildrenLength: true,
        useChildren: useChildrensWorkflow,
      },
      ...initializerItems,
    ],
  });
};
