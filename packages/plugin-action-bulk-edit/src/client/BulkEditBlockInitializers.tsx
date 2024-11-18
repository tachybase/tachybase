import { gridRowColWrap, SchemaInitializer } from '@tachybase/client';

import { CreateFormBulkEditBlockInitializer } from './CreateFormBulkEditBlockInitializer';

export const bulkEditBlockInitializers = new SchemaInitializer({
  name: 'popup:bulkEdit:addBlock',
  wrap: gridRowColWrap,
  title: '{{t("Add block")}}',
  icon: 'PlusOutlined',
  items: [
    {
      type: 'itemGroup',
      title: '{{t("Data blocks")}}',
      name: 'dataBlocks',
      children: [
        {
          name: 'form',
          title: '{{t("Form")}}',
          Component: CreateFormBulkEditBlockInitializer,
        },
      ],
    },
    {
      type: 'itemGroup',
      title: '{{t("Other blocks")}}',
      name: 'otherBlocks',
      children: [
        {
          name: 'markdown',
          title: '{{t("Demonstration text")}}',
          Component: 'MarkdownBlockInitializer',
        },
      ],
    },
  ],
});
