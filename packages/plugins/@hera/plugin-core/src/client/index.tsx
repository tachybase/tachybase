import { EditTitleField, Plugin } from '@tachybase/client';
import { autorun, isValid, useFieldSchema } from '@tachybase/schema';

import {
  AssociatedField,
  CalcResult,
  CustomAssociatedField,
  CustomComponentDispatcher,
  customComponentDispatcherSettings,
  CustomComponentStub,
  CustomField,
  ExcelFile,
  Expression,
  SignatureInput,
} from './components';
import { PluginAssistant } from './features/assistant';
import { PluginGroupBlock } from './features/block-group';
import { PluginContextMenu } from './features/context-menu';
import { PluginCustomComponents } from './features/custom-components';
import { DepartmentsPlugin } from './features/departments';
import { EmbedPlugin } from './features/embed';
import { PluginExtendedFilterForm } from './features/extended-filter-form';
import { PluginFieldAppends } from './features/field-appends';
import { PluginHeraVersion } from './features/hera-version';
import { PluginOutbound } from './features/outbound';
import { PluginPageStyle } from './features/page-style';
import { PluginPDF } from './features/pdf';
import { PluginWorkflowBulk } from './features/workflow-bulk';
import { PluginWorkflowInterceptor } from './features/workflow-interceptor';
import { useGetCustomAssociatedComponents } from './hooks/useGetCustomAssociatedComponents';
import { useGetCustomComponents } from './hooks/useGetCustomComponents';
import {
  AssociatedFieldInterface,
  CalcFieldInterface,
  CustomAssociatedFieldInterface,
  CustomFieldInterface,
  ExcelFieldInterface,
  SignaturePadFieldInterface,
} from './interfaces';
import { TstzrangeFieldInterface } from './interfaces/TstzrangeFieldInterface';
import { Locale, tval } from './locale';
import { AdminLayout, DetailsPage, PageLayout } from './pages';
import { AutoComplete } from './schema-components';
import AssociationCascader from './schema-components/association-cascader/AssociationCascader';
import { CreateSubmitActionInitializer, SettingBlockInitializer } from './schema-initializer';
import { useCreateActionProps } from './schema-initializer/actions/hooks/useCreateActionProps';
import {
  SheetBlock,
  SheetBlockInitializer,
  SheetBlockProvider,
  sheetBlockSettings,
  SheetBlockToolbar,
} from './schema-initializer/blocks/SheetBlockInitializer';
import {
  EditFormulaTitleField,
  EditTitle,
  IsTablePageSize,
  PageModeSetting,
  useFormulaTitleVisible,
  usePaginationVisible,
} from './schema-settings';
import { SchemaSettingsDatePickerType } from './schema-settings/SchemaSettingsDatePickerType';
import {
  SchemaSettingsDatePresets,
  useCustomPresets,
  useCustomPresets1,
} from './schema-settings/SchemaSettingsDatePresets';
import { SchemaSettingsSubmitDataType } from './schema-settings/SchemaSettingsSubmitDataType';
import { PluginSettingsHelper } from './settings-manager-components';

export { usePDFViewerRef } from './features/pdf/PDFVIewerBlockInitializer';
export * from './components/custom-components/custom-components';

export class PluginCoreClient extends Plugin {
  locale: Locale;

  async afterAdd() {
    await this.app.pm.add(PluginGroupBlock);
    await this.app.pm.add(EmbedPlugin);
    await this.app.pm.add(DepartmentsPlugin);
    await this.app.pm.add(PluginPageStyle);
    await this.app.pm.add(PluginHeraVersion);
    await this.app.pm.add(PluginContextMenu);
    await this.app.pm.add(PluginAssistant);
    await this.app.pm.add(PluginWorkflowBulk);
    await this.app.pm.add(PluginWorkflowInterceptor);
    await this.app.pm.add(PluginPDF);
    await this.app.pm.add(PluginExtendedFilterForm);
    await this.app.pm.add(PluginOutbound);
    // await this.app.pm.add(PluginModeHighlight);
    await this.app.pm.add(PluginFieldAppends);
    await this.app.pm.add(PluginCustomComponents);
  }

  async registerSettings() {
    this.schemaSettingsManager.add(sheetBlockSettings);
    this.schemaSettingsManager.add(customComponentDispatcherSettings);

    this.schemaSettingsManager.addItem('fieldSettings:component:DatePicker', 'datePickerType', {
      Component: SchemaSettingsDatePickerType,
    });
    this.schemaSettingsManager.addItem('fieldSettings:component:DatePicker', 'datePresets', {
      Component: SchemaSettingsDatePresets,
    });

    this.schemaSettingsManager.addItem('actionSettings:updateSubmit', 'submitDataType', {
      Component: SchemaSettingsSubmitDataType,
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
    this.app.schemaSettingsManager.addItem('actionSettings:submit', 'pageMode', {
      Component: PageModeSetting,
      useVisible() {
        const fieldSchema = useFieldSchema();
        return isValid(fieldSchema?.['x-action-settings']?.pageMode);
      },
    });
  }

  async registerScopesAndComponents() {
    this.app.addScopes({
      useCreateActionProps,
      useGetCustomAssociatedComponents,
      useGetCustomComponents,
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
      PageLayout,
      SettingBlock: SettingBlockInitializer,
      SheetBlock,
      SheetBlockInitializer,
      SheetBlockProvider,
      SheetBlockToolbar,
      SignatureInput,
      ExcelFile,
    });
  }

  async registerRouters() {
    this.app.router.add('admin.details_page', {
      path: '/admin/:name/page/:pageId/records/*',
      Component: DetailsPage,
    });
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
    this.app.schemaInitializerManager.addItem('page:addBlock', settingBlockItem.name, settingBlockItem);
    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.sheetBlock', {
      title: tval('Sheet'),
      Component: 'SheetBlockInitializer',
    });
    this.app.schemaInitializerManager.addItem('kanban:configureActions', refreshActionItem.name, refreshActionItem);
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
      ExcelFieldInterface,
      TstzrangeFieldInterface,
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
    await new PluginSettingsHelper(this.app).load();
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
