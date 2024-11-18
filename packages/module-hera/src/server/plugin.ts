import { InjectedPlugin, Plugin } from '@tachybase/server';

import {
  LinkManagerController,
  PluginVersionController,
  RobotController,
  SystemMessageController,
  TokenConfigurationController,
} from './actions';
import { DepartmentsPlugin } from './features/departments';
import CalcField from './fields/calc';
import TstzrangeField from './fields/tstzrange';
import { WebControllerService as WebService } from './services/web-service';

@InjectedPlugin({
  Services: [WebService],
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
    this.addFeature(DepartmentsPlugin);
  }

  async load() {}
}
export default PluginCoreServer;
