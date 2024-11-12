import './actions';

import path from 'path';
import { Plugin } from '@tachybase/server';
import { Container } from '@tachybase/utils';

import { PluginDemo } from './features/demo/plugin';
import { DepartmentsPlugin } from './features/departments';
import CalcField from './fields/calc';
import TstzrangeField from './fields/tstzrange';
import { ConnectionManager } from './services/connection-manager';
import { FontManager } from './services/font-manager';
import { SqlLoader } from './services/sql-loader';
import { WebControllerService as WebService } from './services/web-service';

export class PluginCoreServer extends Plugin {
  async afterAdd() {
    this.db.registerFieldTypes({
      calc: CalcField,
      tstzrange: TstzrangeField,
    });
    this.addFeature(DepartmentsPlugin);
    // this.addFeature(PluginDemo);
  }

  async load() {
    try {
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
}
export default PluginCoreServer;
