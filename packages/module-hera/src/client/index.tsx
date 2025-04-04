import { Plugin, useFormulaTitleVisible } from '@tachybase/client';
import { CodeMirror } from '@tachybase/components';

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
import { PluginCustomComponents } from './features/custom-components';
import { EmbedPlugin } from './features/embed';
import { PluginFieldAppends } from './features/field-appends';
import { PluginHeraVersion } from './features/hera-version';
import { PluginOutbound } from './features/outbound';
import { PluginPDF } from './features/pdf';
import { PluginSheet } from './features/sheet';
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
import { SettingBlockInitializer } from './schema-initializer';
import { EditTitle, IsTablePageSize, usePaginationVisible } from './schema-settings';
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
    await this.app.pm.add(EmbedPlugin);
    await this.app.pm.add(PluginHeraVersion);
    await this.app.pm.add(PluginPDF);
    await this.app.pm.add(PluginOutbound);
    // await this.app.pm.add(PluginModeHighlight);
    await this.app.pm.add(PluginFieldAppends);
    await this.app.pm.add(PluginCustomComponents);
    await this.app.pm.add(PluginSheet);
    // await this.app.pm.add(PluginDemo);
  }

  async registerSettings() {
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
    this.schemaSettingsManager.addItem('FormItemSettings', 'isTablePageSize', {
      Component: IsTablePageSize,
      useVisible: usePaginationVisible,
    });
  }

  async registerScopesAndComponents() {
    this.app.addScopes({
      useGetCustomAssociatedComponents,
      useGetCustomComponents,
      useCustomPresets1,
      useCustomPresets,
    });

    this.app.addComponents({
      AssociatedField,
      CalcResult,
      CodeMirror,
      CustomAssociatedField,
      CustomComponentDispatcher,
      CustomComponentStub,
      CustomField,
      EditTitle,
      Expression,
      SettingBlock: SettingBlockInitializer,
      SignatureInput,
      ExcelFile,
    });
  }

  async registerRouters() {}

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
      console.info('current scopes', this.app.scopes);
    }
  }

  async load() {
    this.locale = new Locale(this.app);
    await new PluginSettingsHelper(this.app).load();
    await this.registerScopesAndComponents();
    await this.registerSettings();
    await this.registerRouters();
    await this.registerInterfaces();
  }
}

export default PluginCoreClient;
