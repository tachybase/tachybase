import './actions';

import path from 'path';
import Application, { InstallOptions, NoticeLevel, Plugin, type PluginOptions } from '@tachybase/server';
import { Container } from '@tachybase/utils';

import { DepartmentsPlugin } from './features/departments';
import CalcField from './fields/calc';
import TstzrangeField from './fields/tstzrange';
import { ConnectionManager } from './services/connection-manager';
import { FontManager } from './services/font-manager';
import { SqlLoader } from './services/sql-loader';
import { WebControllerService as WebService } from './services/web-service';

export class PluginCoreServer extends Plugin {
  pluginDepartments: DepartmentsPlugin;
  constructor(app: Application, options?: PluginOptions) {
    super(app, options);
    this.pluginDepartments = new DepartmentsPlugin(app, options);
  }
  async afterAdd() {
    this.db.registerFieldTypes({
      calc: CalcField,
      tstzrange: TstzrangeField,
    });
  }
  beforeLoad() {
    this.pluginDepartments.beforeLoad();
  }
  async load() {
    await this.pluginDepartments.load();
    try {
      await Container.get(ConnectionManager).load();
      const fontManger = Container.get(FontManager);
      const sqlLoader = Container.get(SqlLoader);
      await sqlLoader.loadSqlFiles(path.join(__dirname, './sqls'));
      await fontManger.loadFonts();
      // init web controllers
      await Container.get(WebService).load();
      this.app.acl.allow('link-manage', 'init', 'public');
      this.app.acl.allow('hera', 'version', 'public');
    } catch (err) {
      console.warn(err);
    }
  }
  async install(options?: InstallOptions) {
    await this.pluginDepartments.install(options);
  }
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}
export default PluginCoreServer;
