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

  async load() {
    this.app.acl.registerSnippet({
      name: 'pm.system-services.hera.linkmanage',
      actions: ['link-manage:*'],
    });
    this.app.acl.registerSnippet({
      name: 'pm.system-services.hera.token',
      actions: ['token-configuration:*'],
    });
  }
}
export default PluginCoreServer;
