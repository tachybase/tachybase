import { useTranslation } from 'react-i18next';

import { CompatibleSchemaInitializer } from '../../../application/schema-initializer/CompatibleSchemaInitializer';
import { useCollection } from '../../../data-source/collection/CollectionProvider';
import { gridRowColWrap } from '../../../schema-initializer/utils';

/**
 * @deprecated
 */
export const createFormBlockInitializers_deprecated = new CompatibleSchemaInitializer({
  name: 'CreateFormBlockInitializers',
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
          Component: 'CreateFormBlockInitializer',
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

export const createFormBlockInitializers = new CompatibleSchemaInitializer(
  {
    name: 'popup:addNew:addBlock',
    wrap: gridRowColWrap,
    title: '{{t("Add block")}}',
    icon: 'PlusOutlined',
    items: [
      {
        type: 'itemGroup',
        title: '{{t("Data blocks")}}',
        name: 'dataBlocks',
        useChildren() {
          const currentCollection = useCollection();
          const { t } = useTranslation();

          return [
            {
              name: 'form',
              title: '{{t("Form")}}',
              Component: 'FormBlockInitializer',
              collectionName: currentCollection.name,
              dataSource: currentCollection.dataSource,
              componentProps: {
                filterCollections({ collection, associationField }) {
                  if (associationField) {
                    return false;
                  }
                  if (collection.name === currentCollection.name) {
                    return true;
                  }
                },
                showAssociationFields: true,
                onlyCurrentDataSource: true,
                hideSearch: true,
                componentType: 'FormItem',
                currentText: t('Current collection'),
                otherText: t('Other collections'),
              },
            },
          ];
        },
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
  },
  createFormBlockInitializers_deprecated,
);
