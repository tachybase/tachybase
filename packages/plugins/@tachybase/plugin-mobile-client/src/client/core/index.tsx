import { SchemaComponentOptions } from '@tachybase/client';
import React from 'react';
import {
  MMenuBlockInitializer,
  MMenu,
  MContainer,
  MTabBar,
  MPage,
  MHeader,
  MSettingsBlockInitializer,
  MSettings,
  useGridCardBlockItemProps,
  useGridCardBlockProps,
  TabSearch,
  TabSearchProvider,
  TabSearchBlockInitializer,
  TabSearchFieldItem,
  TabSearchFieldMItem,
  TabSearchCollapsibleInputItem,
  TabSearchCollapsibleInputMItem,
  TabSearchFieldSchemaInitializerGadget,
  SwiperBlockInitializer,
  SwiperBlock,
  SwiperPage,
  ImageSearchView,
  ImageSearchInitializer,
  ImageSearchProvider,
  ImageSearchItemIntializer,
  ImageSearchItemToolbar,
  ImageSearchItemView,
  NoticeBlock,
  NoticeBlockInitializer,
  useSwiperBlockProps,
  usePropsOptionalImageSearchItemField,
  usePropsRelatedImageSearchItemField,
  useTabSearchFieldItemProps,
  useTabSearchFieldItemRelatedProps,
  MInput,
  MCheckbox,
  MDatePicker,
  MRadio,
  MImageUploader,
} from './schema';
import './bridge';
import './assets/svg';

export const MobileCore: React.FC = (props) => {
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
        TabSearch,
        TabSearchProvider,
        TabSearchBlockInitializer,
        TabSearchFieldItem,
        TabSearchFieldMItem,
        TabSearchCollapsibleInputItem,
        TabSearchCollapsibleInputMItem,
        TabSearchFieldSchemaInitializerGadget,
        SwiperBlockInitializer,
        SwiperBlock,
        SwiperPage,
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
