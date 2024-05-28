import React, { PropsWithChildren } from 'react';
import { SchemaComponentOptions } from '@tachybase/client';

import {
  CollectionField,
  ImageSearchInitializer,
  ImageSearchItemIntializer,
  ImageSearchItemToolbar,
  ImageSearchItemView,
  ImageSearchProvider,
  ImageSearchView,
  MCheckbox,
  MContainer,
  MDatePicker,
  MHeader,
  MImageUploader,
  MInput,
  MMenu,
  MMenuBlockInitializer,
  MPage,
  MRadio,
  MSettings,
  MSettingsBlockInitializer,
  MTabBar,
  NoticeBlock,
  NoticeBlockInitializer,
  SwiperBlock,
  SwiperBlockInitializer,
  SwiperPage,
  TabSearch,
  TabSearchBlockInitializer,
  TabSearchCollapsibleInputItem,
  TabSearchCollapsibleInputMItem,
  TabSearchFieldItem,
  TabSearchFieldMItem,
  TabSearchFieldSchemaInitializerGadget,
  TabSearchProvider,
  useGridCardBlockItemProps,
  useGridCardBlockProps,
  usePropsOptionalImageSearchItemField,
  usePropsRelatedImageSearchItemField,
  useSwiperBlockProps,
  useTabSearchFieldItemProps,
  useTabSearchFieldItemRelatedProps,
} from './schema';

import './bridge';
import './assets/svg';

export const MobileCore: React.FC<PropsWithChildren> = (props) => {
  return (
    <SchemaComponentOptions
      components={{
        MMenuBlockInitializer,
        MSettingsBlockInitializer,
        MContainer,
        MMenu,
        MTabBar,
        MPage,
        MHeader,
        MSettings,

        SwiperBlockInitializer,
        SwiperBlock,
        SwiperPage,

        TabSearch,
        TabSearchProvider,
        TabSearchBlockInitializer,
        TabSearchFieldItem,
        TabSearchFieldMItem,
        TabSearchCollapsibleInputItem,
        TabSearchCollapsibleInputMItem,
        TabSearchFieldSchemaInitializerGadget,

        ImageSearchView: ImageSearchView,
        ImageSearchInitializer: ImageSearchInitializer,
        ImageSearchProvider: ImageSearchProvider,
        ImageSearchItemIntializer: ImageSearchItemIntializer,
        ImageSearchItemToolbar: ImageSearchItemToolbar,
        ImageSearchItemView: ImageSearchItemView,
        // NoticeBlock,
        // NoticeBlockInitializer,
        MInput,
        MCheckbox,
        MDatePicker,
        MRadio,
        MImageUploader,
        CollectionField: CollectionField,
      }}
      scope={{
        useGridCardBlockItemProps,
        useGridCardBlockProps,
        useSwiperBlockProps,
        usePropsOptionalImageSearchItemField: usePropsOptionalImageSearchItemField,
        usePropsRelatedImageSearchItemField: usePropsRelatedImageSearchItemField,
        useTabSearchFieldItemProps,
        useTabSearchFieldItemRelatedProps,
      }}
    >
      {props.children}
    </SchemaComponentOptions>
  );
};

export * from './schema';
