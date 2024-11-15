import React, { PropsWithChildren } from 'react';
import { MobileProvider, SchemaComponentOptions } from '@tachybase/client';

import {
  ImageSearchInitializer,
  ImageSearchItemIntializer,
  ImageSearchItemToolbar,
  ImageSearchItemView,
  ImageSearchProvider,
  ImageSearchView,
  MCascader,
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
  MSelect,
  MSettings,
  MSettingsBlockInitializer,
  MTabBar,
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
    <MobileProvider>
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

          ImageSearchView,
          ImageSearchInitializer,
          ImageSearchProvider,
          ImageSearchItemIntializer,
          ImageSearchItemToolbar,
          ImageSearchItemView,
          MInput,
          MCheckbox,
          MDatePicker,
          MRadio,
          MImageUploader,
          MCascader,
          MSelect,
          // mobile alternative components
          Input: MInput,
          'Input.TextArea': MInput.TextArea,
          'Radio.Group': MRadio.Group,
          'Checkbox.Group': MCheckbox.Group,
          // 只支持图片，所以暂时禁用
          // 'Upload.Attachment': MImageUploader,
          DatePicker: MDatePicker,
          Select: MSelect,
          AlternativeAssociationSelect: MSelect,
          Cascader: MCascader,
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
    </MobileProvider>
  );
};

export * from './schema';
