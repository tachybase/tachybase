import Application, { InstallOptions, Plugin, type PluginOptions } from '@nocobase/server';
import path from 'path';
import CalcField from './fields/calc';
import { SqlLoader } from './services/sql-loader';
import { ConnectionManager } from './services/connection-manager';
import { FontManager } from './services/font-manager';
import { HomePageService } from './services/home-page-service';
import { WebControllerService as WebService } from './services/web-service';
import './actions';
import { Container } from '@nocobase/utils';
import { DepartmentsPlugin } from './features/departments';
import TstzrangeField from './fields/tstzrange';

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
    Container.reset();
    try {
      Container.set({ id: 'db', value: this.db });
      Container.set({ id: 'app', value: this.app });
      await Container.get(ConnectionManager).load();
      const fontManger = Container.get(FontManager);
      const sqlLoader = Container.get(SqlLoader);
      await sqlLoader.loadSqlFiles(path.join(__dirname, './sqls'));
      await fontManger.loadFonts();
      await Container.get(HomePageService).load();
      // init web controllers
      await Container.get(WebService).load();
      this.app.acl.allow('link-manage', 'init', 'public');
      this.app.acl.allow('hera', 'version', 'public');
    } catch (err) {
      console.warn(err);
    }
  }
  async install(options?: InstallOptions) {
    this.pluginDepartments.install(options);
  }
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}
export default PluginCoreServer;
