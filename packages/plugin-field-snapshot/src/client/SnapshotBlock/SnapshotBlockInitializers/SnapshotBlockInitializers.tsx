import { gridRowColWrap, SchemaInitializer } from '@tachybase/client';

import { NAMESPACE } from '../../locale';

export const snapshotBlockInitializers = new SchemaInitializer({
  name: 'popup:snapshot:addBlock',
  wrap: gridRowColWrap,
  title: `{{t("Add block", { ns: "${NAMESPACE}" })}}`,
  icon: 'PlusOutlined',
  items: [
    {
      type: 'itemGroup',
      title: '{{t("Current record blocks")}}',
      name: 'currentRecordBlocks',
      children: [
        {
          name: 'details',
          title: '{{t("Details")}}',
          Component: 'SnapshotBlockInitializersDetailItem',
          actionInitializers: 'details:configureActions',
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
