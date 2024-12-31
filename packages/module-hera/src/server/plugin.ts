import { InjectedPlugin, Plugin } from '@tachybase/server';

import {
  LinkManagerController,
  PluginVersionController,
  RobotController,
  SystemMessageController,
  TokenConfigurationController,
} from './actions';
import CalcField from './fields/calc';
import TstzrangeField from './fields/tstzrange';

@InjectedPlugin({
  Controllers: [
    RobotController,
    TokenConfigurationController,
    PluginVersionController,
    LinkManagerController,
    SystemMessageController,
  ],
})
export class PluginCoreServer extends Plugin {
  async afterAdd() {
    this.db.registerFieldTypes({
      calc: CalcField,
      tstzrange: TstzrangeField,
    });
  }

  async load() {}
}
export default PluginCoreServer;
