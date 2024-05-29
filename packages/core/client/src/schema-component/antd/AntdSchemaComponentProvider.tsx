import * as components from '.';
import { Plugin } from '../../application/Plugin';
import * as common from '../common';
import { actionSettings } from './action';
import { useFilterActionProps } from './filter/useFilterActionProps';
import { formV1Settings } from './form';
import { filterFormItemSettings, formItemSettings } from './form-item';
import { formDetailsSettings, formSettings, readPrettyFormSettings } from './form-v2';
import { requestChartData } from './g2plot/requestChartData';
import { pageSettings, pageTabSettings } from './page';

export class AntdSchemaComponentPlugin extends Plugin {
  async load() {
    this.addComponents();
    this.addScopes();
    this.addSchemaSettings();
  }

  addComponents() {
    this.app.addComponents({
      ...(components as any),
      ...common,
    });
  }

  addScopes() {
    this.app.addScopes({
      requestChartData,
      useFilterActionProps,
    });
  }

  addSchemaSettings() {
    // page
    this.app.schemaSettingsManager.add(pageSettings);
    this.app.schemaSettingsManager.add(pageTabSettings);

    // form-item
    this.app.schemaSettingsManager.add(formItemSettings);
    this.app.schemaSettingsManager.add(filterFormItemSettings);

    // form-v1
    this.app.schemaSettingsManager.add(formV1Settings);

    // form-v2
    this.app.schemaSettingsManager.add(formSettings);
    this.app.schemaSettingsManager.add(readPrettyFormSettings);
    this.app.schemaSettingsManager.add(formDetailsSettings);

    // action
    this.app.schemaSettingsManager.add(actionSettings);
  }
}
