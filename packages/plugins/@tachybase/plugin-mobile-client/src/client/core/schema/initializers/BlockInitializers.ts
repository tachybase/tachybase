import { CompatibleSchemaInitializer, gridRowColWrap } from '@tachybase/client';

import { generateNTemplate, tval } from '../../../locale';

/**
 * @deprecated
 */
export const mBlockInitializers_deprecated = new CompatibleSchemaInitializer({
  name: 'MBlockInitializers',
  title: '{{t("Add block")}}',
  icon: 'PlusOutlined',
  wrap: gridRowColWrap,
  items: [
    {
      name: 'dataBlocks',
      type: 'itemGroup',
      title: '{{t("Data blocks")}}',
      children: [
        {
          name: 'gridCard',
          type: 'item',
          title: '{{t("Grid Card")}}',
          Component: 'GridCardBlockInitializer',
        },
        {
          name: 'table',
          title: '{{t("Table")}}',
          Component: 'TableBlockInitializer',
        },
        {
          name: 'form',
          title: '{{t("Form")}}',
          Component: 'FormBlockInitializer',
        },
        {
          name: 'details',
          title: '{{t("Details")}}',
          Component: 'DetailsBlockInitializer',
        },
        {
          name: 'calendar',
          title: '{{t("Calendar")}}',
          Component: 'CalendarBlockInitializer',
        },
        {
          name: 'mapBlock',
          title: generateNTemplate('Map'),
          Component: 'MapBlockInitializer',
        },
      ],
    },
    {
      name: 'otherBlocks',
      type: 'itemGroup',
      title: '{{t("Other blocks")}}',
      children: [
        {
          name: 'menu',
          title: generateNTemplate('Menu'),
          Component: 'MMenuBlockInitializer',
        },
        {
          name: 'markdown',
          title: '{{t("Markdown")}}',
          Component: 'MarkdownBlockInitializer',
        },
        {
          name: 'settings',
          title: generateNTemplate('Settings'),
          Component: 'MSettingsBlockInitializer',
        },
      ],
    },
  ],
});

export const mBlockInitializers = new CompatibleSchemaInitializer(
  {
    name: 'mobilePage:addBlock',
    title: '{{t("Add block")}}',
    icon: 'PlusOutlined',
    wrap: gridRowColWrap,
    items: [
      {
        name: 'dataBlocks',
        type: 'itemGroup',
        title: '{{t("Data blocks")}}',
        children: [
          {
            name: 'gridCard',
            type: 'item',
            title: '{{t("Grid Card")}}',
            Component: 'GridCardBlockInitializer',
          },
          {
            name: 'table',
            title: '{{t("Table")}}',
            Component: 'TableBlockInitializer',
          },
          {
            name: 'form',
            title: '{{t("Form")}}',
            Component: 'FormBlockInitializer',
          },
          {
            name: 'details',
            title: '{{t("Details")}}',
            Component: 'DetailsBlockInitializer',
          },
          {
            name: 'calendar',
            title: '{{t("Calendar")}}',
            Component: 'CalendarBlockInitializer',
          },
          {
            name: 'mapBlock',
            title: generateNTemplate('Map'),
            Component: 'MapBlockInitializer',
          },
          {
            title: tval('Swiper'),
            name: 'swiper',
            type: 'item',
            Component: 'SwiperBlockInitializer',
          },
          {
            title: 'notice',
            name: 'notice',
            type: 'item',
            Component: 'NoticeBlockInitializer',
          },
          {
            name: 'chartV2',
            title: '{{t("Charts")}}',
            Component: 'ChartV2BlockInitializer',
          },
        ],
      },
      {
        name: 'otherBlocks',
        type: 'itemGroup',
        title: '{{t("Other blocks")}}',
        children: [
          {
            name: 'menu',
            title: generateNTemplate('Menu'),
            Component: 'MMenuBlockInitializer',
          },
          {
            name: 'markdown',
            title: tval('Markdown'),
            Component: 'MarkdownBlockInitializer',
          },
          {
            name: 'settings',
            title: generateNTemplate('Settings'),
            Component: 'MSettingsBlockInitializer',
          },
        ],
      },
      {
        name: 'filterBlocks',
        type: 'itemGroup',
        title: '{{t("Filter blocks")}}',
        children: [
          {
            name: 'tabSearch',
            title: tval('TabSearch'),
            Component: 'TabSearchBlockInitializer',
          },
          {
            name: 'imageSearch',
            title: tval('ImageSearch'),
            icon: 'tab-search',
            Component: 'ImageSearchInitializer',
          },
        ],
      },
    ],
  },
  mBlockInitializers_deprecated,
);
