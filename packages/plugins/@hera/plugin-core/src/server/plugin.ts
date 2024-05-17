import Application, { InstallOptions, Plugin, type PluginOptions } from '@tachybase/server';
import path from 'path';
import CalcField from './fields/calc';
import { SqlLoader } from './services/sql-loader';
import { ConnectionManager } from './services/connection-manager';
import { FontManager } from './services/font-manager';
import { HomePageService } from '../../../plugin-homepage/src/server/home-page-service';
import { WebControllerService as WebService } from './services/web-service';
import './actions';
import { Container } from '@tachybase/utils';
import { DepartmentsPlugin } from './features/departments';
import TstzrangeField from './fields/tstzrange';
import { PluginInterception } from './features/interception';

export class PluginCoreServer extends Plugin {
  pluginDepartments: DepartmentsPlugin;
  pluginInterception: PluginInterception;
  constructor(app: Application, options?: PluginOptions) {
    super(app, options);
    this.pluginDepartments = new DepartmentsPlugin(app, options);
    this.pluginInterception = new PluginInterception(app, options);
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
    await this.pluginInterception.load();
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
    await Container.get(HomePageService).install();
  }
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}
export default PluginCoreServer;
