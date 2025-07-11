import { Application } from '../Application';
import { EditableSchemaSettings } from './EditableSchemaSettings';
import { EditableSchemaSettingsItemTypeWithoutName } from './types';

// import { SchemaSettings } from './SchemaSettings';
// import { SchemaSettingsItemTypeWithoutName } from './types';

interface ActionType {
  type: 'add' | 'remove';
  itemName: string;
  data?: any;
}

export class EditableSchemaSettingsManager {
  protected schemaSettings: Record<string, EditableSchemaSettings<any>> = {};
  protected actionList: Record<string, ActionType[]> = {};

  constructor(
    protected _schemaSettings: EditableSchemaSettings<any>[] = [],
    protected app: Application,
  ) {
    this.app = app;

    this.add(..._schemaSettings);
  }

  add<T = any>(...schemaSettingList: EditableSchemaSettings<T>[]) {
    schemaSettingList.forEach((schemaSetting) => {
      this.schemaSettings[schemaSetting.name] = schemaSetting;
      if (Array.isArray(this.actionList[schemaSetting.name])) {
        this.actionList[schemaSetting.name].forEach((item) => {
          schemaSetting[item.type](item.itemName, item.data);
        });
        this.actionList[schemaSetting.name] = undefined;
      }
    });
  }

  addItem(schemaSettingName: string, itemName: string, data: EditableSchemaSettingsItemTypeWithoutName) {
    const schemaSetting = this.get(schemaSettingName);
    if (!schemaSetting) {
      if (!this.actionList[schemaSettingName]) {
        this.actionList[schemaSettingName] = [];
      }
      this.actionList[schemaSettingName].push({
        type: 'add',
        itemName: itemName,
        data,
      });
    } else {
      schemaSetting.add(itemName, data);
    }
  }

  get<T>(name: string): EditableSchemaSettings<T> | undefined {
    return this.schemaSettings[name];
  }

  getAll() {
    return this.schemaSettings;
  }

  has(name: string) {
    return !!this.get(name);
  }

  remove(name: string) {
    delete this.schemaSettings[name];
  }

  removeItem(schemaSettingName: string, itemName: string) {
    const schemaSetting = this.get(schemaSettingName);
    if (!schemaSetting) {
      if (!this.actionList[schemaSettingName]) {
        this.actionList[schemaSettingName] = [];
      }
      this.actionList[schemaSettingName].push({
        type: 'remove',
        itemName: itemName,
      });
    } else {
      schemaSetting.remove(itemName);
    }
  }
}
