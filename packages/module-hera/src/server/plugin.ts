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
import { FontManager } from './services/font-manager';
import { WebControllerService as WebService } from './services/web-service';

@InjectedPlugin({
  Services: [FontManager, WebService],
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

  async load() {
    try {
      this.app.acl.allow('link-manage', 'init', 'public');
      this.app.acl.allow('hera', 'version', 'public');
    } catch (err) {
      console.warn(err);
    }
  }
}
export default PluginCoreServer;
