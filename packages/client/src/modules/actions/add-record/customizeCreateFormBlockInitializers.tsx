import { SchemaInitializer } from '../../../application/schema-initializer/SchemaInitializer';
import { gridRowColWrap } from '../../../schema-initializer/utils';

export const customizeCreateFormBlockInitializers = new SchemaInitializer({
  name: 'popup:addRecord:addBlock',
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
          Component: 'FormBlockInitializer',
          isCusomeizeCreate: true,
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
