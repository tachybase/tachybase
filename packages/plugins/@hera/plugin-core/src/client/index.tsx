import React from 'react';
import { autorun } from '@formily/reactive';
import {
  Menu,
  Plugin,
  RemoteSchemaTemplateManagerProvider,
  EditTitleField,
  SchemaSettingOptions,
  useCollection,
} from '@nocobase/client';
import { remove } from 'lodash';
import { CalendarBlockInitializer } from './schema-initializer/CalendarBlockInitializer';
import { MenuDesigner } from './components/ExtendedMenuDesigner';
import { SessionSubmit, SessionUpdate } from './components/ExtendedActionDesigner';
import { HomePageConfiguration } from './pages/HomePageConfiguration';
import { Configuration } from './components/TokenConfiguration';
import { InternalPDFViewer } from './schema-components/PDFViewer';
import {
  PDFViewerBlockInitializer,
  PDFViewerPrintActionInitializer,
  PDFViewerProvider,
  pdfViewActionInitializer,
  usePDFViewerPrintActionProps,
} from './schema-initializer/PDFVIewerBlockInitializer';
import { OutboundButton } from './components/OutboundButton';
import { useCustomizeUpdateActionProps } from './hooks/useCustomizeUpdateActionProps';
import { OutboundLinkActionInitializer } from './schema-initializer/OutboundLinkActionInitializer';
import { CreateSubmitActionInitializer } from './schema-initializer/CreateSubmitActionInitializer';
import { FilterAssociatedFields } from './schema-initializer/FilterAssociatedFields';
import { useFieldSchema } from '@formily/react';
import { isValid } from '@formily/shared';
import { useCreateActionProps } from './hooks/useCreateActionProps';
import { useOutboundActionProps } from './hooks/useOutboundActionProps';
import { ExtendedAssociationField } from './schema-components/association-field/Editable';
import { AssociatedField } from './components/AssociatedField';
import { DatePicker } from './schema-components/date-picker';
import { SettingBlockInitializer } from './schema-initializer/SettingBlockInitializer';
import {
  EditFormulaTitleField,
  IsTablePageSize,
  useFormulaTitleVisible,
  usePaginationVisible,
  EditTitle,
  SetFilterScope,
  useSetFilterScopeVisible,
} from './components/SchemaSettingOptions';
import { SignatureInput } from './components/SignatureInput';
import { RemoteSelect } from './schema-components/remote-select';
import { Select } from './schema-components/select/Select';
import { Locale, tval } from './locale';
import { LinkManager } from './components/LinkManager';
import {
  GroupBlockInitializer,
  GroupBlockProvider,
  GroupBlockToolbar,
  groupBlockSettings,
} from './schema-initializer/GroupBlockInitializer';
import { useFilterFormCustomProps } from './hooks/useFilterFormCustomProps';
import {
  FilterFormItem,
  FilterItemCustomDesigner,
  FilterFormItemCustom,
} from './schema-initializer/FilterFormItemCustomInitializer/FilterFormItemCustom';
import { GroupBlock } from './schema-components/GroupBlock';
import {
  CustomComponentDispatcher,
  CustomComponentStub,
  customComponentDispatcherSettings,
} from './components/CustomComponentDispatcher';
import { useFilterBlockActionProps } from './hooks/useFilterBlockActionProps';
import { AfterSuccess } from './components/Action.Designer';
import { GroupBlockConfigure } from './components/GroupBlockConfigure/GroupBlockConfigure';
import { AssociatedFieldInterface } from './interfaces/associated';
import { CalcFieldInterface } from './interfaces/calc';
import { CustomFieldInterface } from './interfaces/custom';
import { CustomAssociatedFieldInterface } from './interfaces/customAssociated';
import { SignaturePadFieldInterface } from './interfaces/signatureSchema';
import { CalcResult } from './components/CalcResult';
import { CustomAssociatedField } from './components/CustomAssociatedField';
import Expression from './components/Expression';
import { CustomField } from './components/CustomField';
import { useGetCustomAssociatedComponents } from './hooks/useGetCustomAssociatedComponents';
import { useGetCustomComponents } from './hooks/useGetCustomComponents';
import { AutoComplete } from './schema-components/AutoComplete/AutoComplete';
import { AdminLayout, DetailsPage, HomePage, OutboundPage, PageLayout } from './pages';
export { usePDFViewerRef } from './schema-initializer/PDFVIewerBlockInitializer';
export * from './custom-components';

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
      useOutboundActionProps,
      useCustomizeUpdateActionProps,
      useCreateActionProps,
      useFilterFormCustomProps,
      useFilterBlockActionProps,
      usePDFViewerPrintActionProps,
      useGetCustomAssociatedComponents,
      useGetCustomComponents,
    });

    this.app.addComponents({
      AssociatedField,
      Expression,
      CustomField,
      CustomAssociatedField,
      CalcResult,
      PDFViewerPrintActionInitializer,
      PDFViewerProvider,
      GroupBlock,
      CustomComponentStub,
      CustomComponentDispatcher,
      GroupBlockInitializer,
      GroupBlockToolbar,
      GroupBlockProvider,
      DatePicker,
      RemoteSelect,
      SignatureInput,
      AssociationField: ExtendedAssociationField,
      OutboundButton,
      OutboundLinkActionInitializer,
      PDFViewerBlockInitializer,
      PDFViwer: InternalPDFViewer,
      AdminLayout,
      ExtendedCalendarBlockInitializer: CalendarBlockInitializer,
      SettingBlock: SettingBlockInitializer,
      CreateSubmitActionInitializer,
      PageLayout,
      FilterAssociatedFields,
      FilterFormItemCustom,
      FilterFormItem,
      FilterItemCustomDesigner,
      Select,
      EditTitle,
      EditTitleField,
      AfterSuccess,
      GroupBlockConfigure,
      AutoComplete,
      Menu: {
        ...Menu,
        // @ts-ignore
        Designer: MenuDesigner,
      },
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

  async afterAdd() {}
  async beforeLoad() {}
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

  async registerInterfaces() {
    this.app.dataSourceManager.addFieldInterfaces([
      AssociatedFieldInterface,
      CalcFieldInterface,
      CustomFieldInterface,
      CustomAssociatedFieldInterface,
      SignaturePadFieldInterface,
    ]);
  }

  async load() {
    this.locale = new Locale(this.app);
    await this.registerTricks();
    await this.registerScopesAndComponents();
    await this.registerSettings();
    await this.registerActions();
    await this.registerRouters();
    await this.registerInterfaces();
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
    const previewBlockItem = {
      title: tval('preview block'),
      name: 'previewBlock',
      type: 'itemGroup',
      children: [],
    };
    this.app.schemaInitializerManager.get('RecordBlockInitializers').add(previewBlockItem.name, previewBlockItem);

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
