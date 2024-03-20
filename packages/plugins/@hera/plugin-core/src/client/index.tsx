import React from 'react';
import { Plugin, RemoteSchemaTemplateManagerProvider, EditTitleField, useCollection } from '@nocobase/client';
import { remove } from 'lodash';
import { useFieldSchema } from '@formily/react';
import { isValid } from '@formily/shared';
import { autorun } from '@formily/reactive';
import { Locale, tval } from './locale';
import {
  PageModeSetting,
  EditFormulaTitleField,
  IsTablePageSize,
  useFormulaTitleVisible,
  usePaginationVisible,
  EditTitle,
  SetFilterScope,
  useSetFilterScopeVisible,
  FilterVariableInput,
  EditDefaultValue,
} from './schema-settings';
import { useCreateActionProps } from './schema-initializer/actions/hooks/useCreateActionProps';
import { useFilterBlockActionProps } from './hooks/useFilterBlockActionProps';
import { useFilterFormCustomProps } from './hooks/useFilterFormCustomProps';
import { useGetCustomAssociatedComponents } from './hooks/useGetCustomAssociatedComponents';
import { useGetCustomComponents } from './hooks/useGetCustomComponents';
import { AdminLayout, DetailsPage, HomePage, OutboundPage, PageLayout } from './pages';
import { PluginSettingsHelper } from './settings-manager-components';
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
  SignatureInput,
} from './components';
import { AutoComplete, InternalPDFViewer } from './schema-components';
import {
  CreateSubmitActionInitializer,
  FilterFormItem,
  FilterFormItemCustom,
  FilterItemCustomDesigner,
  GroupBlockPlugin,
  OutboundActionHelper,
  PDFViewerBlockInitializer,
  PDFViewerPrintActionInitializer,
  PDFViewerProvider,
  SettingBlockInitializer,
  pdfViewActionInitializer,
  usePDFViewerPrintActionProps,
} from './schema-initializer';
import {
  SheetBlock,
  SheetBlockInitializer,
  SheetBlockProvider,
  SheetBlockToolbar,
  sheetBlockSettings,
} from './schema-initializer/blocks/SheetBlockInitializer';
import AssociationCascader from './schema-components/association-cascader/AssociationCascader';
import { SchemaSettingsDatePickerType } from './schema-settings/SchemaSettingsDatePickerType';
import {
  SchemaSettingsDatePresets,
  useCustomPresets,
  useCustomPresets1,
} from './schema-settings/SchemaSettingsDatePresets';
export { usePDFViewerRef } from './schema-initializer';
export * from './components/custom-components/custom-components';

export class PluginCoreClient extends Plugin {
  locale: Locale;

  async afterAdd() {
    await this.app.pm.add(GroupBlockPlugin);
  }

  async registerSettings() {
    this.schemaSettingsManager.add(sheetBlockSettings);
    this.schemaSettingsManager.add(customComponentDispatcherSettings);
    this.schemaSettingsManager.addItem('FilterFormItemSettings', 'formulatitleField', {
      Component: EditFormulaTitleField,
      useVisible: useFormulaTitleVisible,
    });
    this.schemaSettingsManager.addItem('FilterFormItemSettings', 'editDefaultValue', {
      Component: EditDefaultValue,
    });
    this.schemaSettingsManager.addItem('fieldSettings:component:Select', 'editDefaultValue', {
      Component: EditDefaultValue,
    });

    this.schemaSettingsManager.addItem('fieldSettings:component:DatePicker', 'datePickerType', {
      Component: SchemaSettingsDatePickerType,
    });
    this.schemaSettingsManager.addItem('fieldSettings:component:DatePicker', 'datePresets', {
      Component: SchemaSettingsDatePresets,
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
    this.app.schemaSettingsManager.addItem('actionSettings:submit', 'pageMode', {
      Component: PageModeSetting,
      useVisible() {
        const fieldSchema = useFieldSchema();
        return isValid(fieldSchema?.['x-action-settings']?.pageMode);
      },
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

  async registerScopesAndComponents() {
    this.app.addScopes({
      useCreateActionProps,
      useFilterBlockActionProps,
      useFilterFormCustomProps,
      useGetCustomAssociatedComponents,
      useGetCustomComponents,
      usePDFViewerPrintActionProps,
      useCustomPresets1,
      useCustomPresets,
    });

    this.app.addComponents({
      AdminLayout,
      AssociationCascader,
      AssociatedField,
      AutoComplete,
      CalcResult,
      CreateSubmitActionInitializer,
      CustomAssociatedField,
      CustomComponentDispatcher,
      CustomComponentStub,
      CustomField,
      EditTitle,
      EditTitleField,
      Expression,
      FilterFormItem,
      FilterFormItemCustom,
      FilterItemCustomDesigner,
      FilterVariableInput,
      PDFViewerBlockInitializer,
      PDFViewerPrintActionInitializer,
      PDFViewerProvider,
      PDFViwer: InternalPDFViewer,
      PageLayout,
      SettingBlock: SettingBlockInitializer,
      SheetBlock,
      SheetBlockInitializer,
      SheetBlockProvider,
      SheetBlockToolbar,
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
    const settingBlockItem = {
      name: 'setting',
      title: tval('System setting'),
      Component: 'SettingBlock',
    };
    const refreshActionItem = {
      type: 'item',
      name: 'refreshAction',
      title: tval('Refresh'),
      Component: 'RefreshActionInitializer',
      schema: {
        'x-align': 'right',
      },
    };
    const customItem = {
      title: tval('Custom filter field'),
      name: 'custom',
      type: 'item',
      Component: 'FilterFormItemCustom',
    };
    this.schemaInitializerManager.add(pdfViewActionInitializer);
    this.app.schemaInitializerManager.addItem('page:addBlock', settingBlockItem.name, settingBlockItem);
    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.sheetBlock', {
      title: tval('Sheet'),
      Component: 'SheetBlockInitializer',
    });
    this.app.schemaInitializerManager.addItem('kanban:configureActions', refreshActionItem.name, refreshActionItem);
    this.app.schemaInitializerManager.addItem('filterForm:configureFields', 'custom-item-divider', {
      type: 'divider',
    });
    this.app.schemaInitializerManager.addItem('filterForm:configureFields', customItem.name, customItem);
    const addCustomComponent = {
      name: 'addCustomComponent',
      title: tval('Add custom component'),
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
    this.app.schemaInitializerManager.addItem('form:configureFields', addCustomComponent.name, addCustomComponent);
    this.app.schemaInitializerManager.addItem('details:configureFields', addCustomComponent.name, addCustomComponent);
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
    await this.registerSchemaInitializer();
    if (process.env.NODE_ENV !== 'production') {
      console.info('current components', this.app.components);
      console.info('current schemaSettings', this.app.schemaSettingsManager.getAll());
      console.info('current schemaInitializer', this.app.schemaInitializerManager.getAll());
      console.info('current providers', this.app.providers);
    }
  }

  async load() {
    this.locale = new Locale(this.app);
    await new OutboundActionHelper(this.app).load();
    await new PluginSettingsHelper(this.app).load();
    await this.registerTricks();
    await this.registerScopesAndComponents();
    await this.registerSettings();
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
