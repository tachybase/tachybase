import React from 'react';
import {
  Menu,
  Plugin,
  RemoteSchemaTemplateManagerProvider,
  EditTitleField,
  SchemaSettingOptions,
  useCollection,
} from '@nocobase/client';
import { remove } from 'lodash';
import { useFieldSchema } from '@formily/react';
import { isValid } from '@formily/shared';
import { autorun } from '@formily/reactive';
import { Locale, tval } from './locale';
import {
  SessionSubmit,
  SessionUpdate,
  EditFormulaTitleField,
  IsTablePageSize,
  useFormulaTitleVisible,
  usePaginationVisible,
  EditTitle,
  SetFilterScope,
  useSetFilterScopeVisible,
  AfterSuccess,
} from './schema-settings';
import { useCreateActionProps } from './hooks/useCreateActionProps';
import { useCustomizeUpdateActionProps } from './hooks/useCustomizeUpdateActionProps';
import { useFilterBlockActionProps } from './hooks/useFilterBlockActionProps';
import { useFilterFormCustomProps } from './hooks/useFilterFormCustomProps';
import { useGetCustomAssociatedComponents } from './hooks/useGetCustomAssociatedComponents';
import { useGetCustomComponents } from './hooks/useGetCustomComponents';
import { useOutboundActionProps } from './hooks/useOutboundActionProps';
import { AdminLayout, DetailsPage, HomePage, OutboundPage, PageLayout } from './pages';
import { Configuration, HomePageConfiguration, LinkManager } from './settings-manager-components';
import {
  AssociatedFieldInterface,
  CalcFieldInterface,
  CustomFieldInterface,
  CustomAssociatedFieldInterface,
  SignaturePadFieldInterface,
} from './interfaces';
import {
  AssociatedField,
  CalcResult,
  CustomAssociatedField,
  CustomField,
  CustomComponentDispatcher,
  CustomComponentStub,
  customComponentDispatcherSettings,
  Expression,
  GroupBlockConfigure,
  SignatureInput,
} from './components';
import {
  AutoComplete,
  DatePicker,
  GroupBlock,
  InternalPDFViewer,
  MenuDesigner,
  RemoteSelect,
  Select,
} from './schema-components';
import {
  CalendarBlockInitializer,
  CreateSubmitActionInitializer,
  FilterAssociatedFields,
  FilterFormItem,
  FilterFormItemCustom,
  FilterItemCustomDesigner,
  GroupBlockInitializer,
  GroupBlockProvider,
  GroupBlockToolbar,
  OutboundButton,
  OutboundLinkActionInitializer,
  PDFViewerBlockInitializer,
  PDFViewerPrintActionInitializer,
  PDFViewerProvider,
  SettingBlockInitializer,
  groupBlockSettings,
  pdfViewActionInitializer,
  usePDFViewerPrintActionProps,
} from './schema-initializer';
export { usePDFViewerRef } from './schema-initializer';
export * from './components/custom-components/custom-components';

export class PluginCoreClient extends Plugin {
  locale: Locale;

  async registerSettings() {
    this.app.pluginSettingsManager.add('home_page', {
      title: this.locale.lang('HomePage Config'),
      icon: 'HomeOutlined',
      Component: HomePageConfiguration,
    });
    this.app.pluginSettingsManager.add('token', {
      title: '第三方接入配置',
      icon: 'ShareAltOutlined',
      Component: Configuration,
    });
    this.app.pluginSettingsManager.add('linkmanage', {
      title: '配置链接',
      icon: 'ShareAltOutlined',
      Component: LinkManager,
    });
    this.schemaSettingsManager.add(groupBlockSettings);
    this.schemaSettingsManager.add(customComponentDispatcherSettings);
    this.schemaSettingsManager.addItem('FilterFormItemSettings', 'formulatitleField', {
      Component: EditFormulaTitleField,
      useVisible: useFormulaTitleVisible,
    });
    this.schemaSettingsManager.addItem('FormItemSettings', 'hera-divider', {
      type: 'divider',
      useVisible() {
        const v1 = useFormulaTitleVisible();
        const v2 = usePaginationVisible();
        return v1 || v2;
      },
    });
    this.schemaSettingsManager.addItem('FormItemSettings', 'formulatitleField', {
      Component: EditFormulaTitleField,
      useVisible: useFormulaTitleVisible,
    });
    this.schemaSettingsManager.addItem('FormItemSettings', 'isTablePageSize', {
      Component: IsTablePageSize,
      useVisible: usePaginationVisible,
    });
    this.schemaSettingsManager.addItem('ActionSettings', 'Customize.setFilterScope', {
      Component: SetFilterScope,
      useVisible: useSetFilterScopeVisible,
      useComponentProps() {
        const collection = useCollection();
        return {
          collectionName: collection.name,
        };
      },
    });
    const SchemaSettingOptionItems = this.schemaSettingsManager
      .get('ActionSettings')
      .items.filter((item) => item.name === 'Customize')[0].children;
    SchemaSettingOptionItems.forEach((item) => {
      if (item.name === 'afterSuccess') {
        (item as SchemaSettingOptions).Component = AfterSuccess;
      }
    });

    // 预览区块需要提前加进来，没法放在 afterload 中，这块后面需要重构
    const previewBlockItem = {
      title: tval('preview block'),
      name: 'previewBlock',
      type: 'itemGroup',
      children: [],
    };
    this.app.schemaInitializerManager.get('popup:common:addBlock').add(previewBlockItem.name, previewBlockItem);
  }

  async registerActions() {
    const actionSettings = this.app.schemaSettingsManager.get('ActionSettings');
    actionSettings.add('sessionSubmit', {
      Component: SessionSubmit,
      useVisible() {
        const fieldSchema = useFieldSchema();
        return isValid(fieldSchema?.['x-action-settings']?.sessionSubmit);
      },
    });
    actionSettings.add('sessionUpdate', {
      Component: SessionUpdate,
      useVisible() {
        const fieldSchema = useFieldSchema();
        return isValid(fieldSchema?.['x-action-settings']?.sessionUpdate);
      },
    });
  }

  async registerScopesAndComponents() {
    this.app.addScopes({
      useCreateActionProps,
      useCustomizeUpdateActionProps,
      useFilterBlockActionProps,
      useFilterFormCustomProps,
      useGetCustomAssociatedComponents,
      useGetCustomComponents,
      useOutboundActionProps,
      usePDFViewerPrintActionProps,
    });

    this.app.addComponents({
      AdminLayout,
      AfterSuccess,
      AssociatedField,
      AutoComplete,
      CalcResult,
      CreateSubmitActionInitializer,
      CustomAssociatedField,
      CustomComponentDispatcher,
      CustomComponentStub,
      CustomField,
      DatePicker,
      EditTitle,
      EditTitleField,
      Expression,
      ExtendedCalendarBlockInitializer: CalendarBlockInitializer,
      FilterAssociatedFields,
      FilterFormItem,
      FilterFormItemCustom,
      FilterItemCustomDesigner,
      GroupBlock,
      GroupBlockConfigure,
      GroupBlockInitializer,
      GroupBlockProvider,
      GroupBlockToolbar,
      Menu: {
        ...Menu,
        // @ts-ignore
        Designer: MenuDesigner,
      },
      OutboundButton,
      OutboundLinkActionInitializer,
      PDFViewerBlockInitializer,
      PDFViewerPrintActionInitializer,
      PDFViewerProvider,
      PDFViwer: InternalPDFViewer,
      PageLayout,
      RemoteSelect,
      Select,
      SettingBlock: SettingBlockInitializer,
      SignatureInput,
    });
  }

  async registerRouters() {
    this.app.router.add('outbound', {
      path: '/r/:id',
      element: <OutboundPage />,
    });
    this.app.router.remove('root');
    this.app.router.add('home', {
      path: '/',
      element: <HomePage />,
    });
    this.app.router.add('admin.details_page', {
      path: '/admin/:name/page/:pageId/records/*',
      Component: DetailsPage,
    });
  }

  async registerTricks() {
    // Loading this provider in an unauthenticated state will result in an error; remove it here.
    remove(this.app.providers, ([provider]) => provider === RemoteSchemaTemplateManagerProvider);
  }

  async registerSchemaInitializer() {
    const associationFields = {
      type: 'item',
      name: 'associationFields',
      title: '筛选区块添加一对一的引用',
      Component: 'FilterAssociatedFields',
    };
    const outboundItem = {
      type: 'item',
      name: 'enableActions.outbound',
      title: '外链',
      Component: 'OutboundLinkActionInitializer',
      schema: {
        'x-align': 'right',
      },
    };
    const calendarBlockItem = {
      name: 'calendarV2',
      title: '{{t("Calendar")}}',
      Component: 'ExtendedCalendarBlockInitializer',
    };
    const settingBlockItem = {
      name: 'setting',
      title: tval('System setting'),
      Component: 'SettingBlock',
    };
    const refreshActionItem = {
      type: 'item',
      name: 'refreshAction',
      title: "{{t('Refresh')}}",
      Component: 'RefreshActionInitializer',
      schema: {
        'x-align': 'right',
      },
    };
    const customItem = {
      title: '自定义',
      name: 'custom',
      type: 'item',
      Component: 'FilterFormItemCustom',
    };
    this.schemaInitializerManager.add(pdfViewActionInitializer);
    this.app.schemaInitializerManager.addItem('TableActionInitializers', outboundItem.name, outboundItem);
    this.app.schemaInitializerManager.get('ReadPrettyFormActionInitializers').add(outboundItem.name, outboundItem);
    this.app.schemaInitializerManager.get('BlockInitializers').add(calendarBlockItem.name, calendarBlockItem);
    this.app.schemaInitializerManager.get('BlockInitializers').add(settingBlockItem.name, settingBlockItem);
    this.app.schemaInitializerManager.get('BlockInitializers').add('dataBlocks.groupBlock', {
      title: tval('Group block'),
      Component: 'GroupBlockInitializer',
    });
    this.app.schemaInitializerManager.get('KanbanActionInitializers').add(refreshActionItem.name, refreshActionItem);
    this.app.schemaInitializerManager.get('KanbanActionInitializers').add(outboundItem.name, outboundItem);
    this.app.schemaInitializerManager.get('FilterFormItemInitializers').add(associationFields.name, associationFields);
    this.app.schemaInitializerManager.addItem('FilterFormItemInitializers', 'custom-item-divider', {
      type: 'divider',
    });
    this.app.schemaInitializerManager.addItem('FilterFormItemInitializers', customItem.name, customItem);

    const addCustomComponent = {
      name: 'addCustomComponent',
      title: this.locale.lang('Add custom component'),
      Component: 'BlockItemInitializer',
      schema: {
        type: 'void',
        'x-editable': false,
        'x-decorator': 'FormItem',
        'x-settings': 'customComponentDispatcherSettings',
        'x-component': 'CustomComponentDispatcher',
        'x-component-props': {
          component: 'CustomComponentStub',
        },
      },
    };
    this.app.schemaInitializerManager.addItem('FormItemInitializers', addCustomComponent.name, addCustomComponent);
    this.app.schemaInitializerManager.addItem(
      'ReadPrettyFormItemInitializers',
      addCustomComponent.name,
      addCustomComponent,
    );
  }

  async registerInterfaces() {
    this.app.dataSourceManager.addFieldInterfaces([
      AssociatedFieldInterface,
      CalcFieldInterface,
      CustomFieldInterface,
      CustomAssociatedFieldInterface,
      SignaturePadFieldInterface,
    ]);
  }

  async afterLoad() {
    // log for debug
    if (process.env.NODE_ENV !== 'production') {
      console.info('current components', this.app.components);
      console.info('current schemaSettings', this.app.schemaSettingsManager.getAll());
      console.info('current schemaInitializer', this.app.schemaInitializerManager.getAll());
      console.info('current providers', this.app.providers);
    }
    await this.registerSchemaInitializer();
  }

  async load() {
    this.locale = new Locale(this.app);
    await this.registerTricks();
    await this.registerScopesAndComponents();
    await this.registerSettings();
    await this.registerActions();
    await this.registerRouters();
    await this.registerInterfaces();

    // listen to connected events.
    autorun(() => {
      if (this.app.ws.connected) {
        const data = {
          type: 'plugin-online-user:client',
          payload: {
            token: this.app.apiClient.auth.getToken(),
          },
        };
        this.app.ws.send(JSON.stringify(data));
      }
    });
  }
}

export default PluginCoreClient;
