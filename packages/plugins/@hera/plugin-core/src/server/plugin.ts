import { InstallOptions, Plugin } from '@nocobase/server';
import path from 'path';
import CalcField from './fields/calc';
import { SqlLoader } from './services/sql-loader';
import { ConnectionManager } from './services/connection-manager';
import { isMain } from './utils/multiprocess';
import { FontManager } from './services/font-manager';
import { HomePageService } from './services/home-page-service';
import { WebControllerService as WebService } from './services/web-service';
import './actions';
import { Container } from '@nocobase/utils';

export class PluginCoreServer extends Plugin {
  afterAdd() {
    this.db.registerFieldTypes({
      calc: CalcField,
    });
  }
  beforeLoad() {}
  async load() {
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
    } catch (err) {
      console.warn(err);
    }
  }
  async install(options?: InstallOptions) {}
  async afterEnable() {}
  async afterDisable() {}
  async remove() {}
}
export default PluginCoreServer;