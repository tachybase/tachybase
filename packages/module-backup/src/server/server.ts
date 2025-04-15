import { DumpRulesGroupType } from '@tachybase/database';
import { Plugin } from '@tachybase/server';

import { Dumper } from './dumper';
import backupFilesResourcer from './resourcers/backup-files';

export default class PluginBackupRestoreServer extends Plugin {
  beforeLoad() {
    this.app.acl.registerSnippet({
      name: `pm.${this.name}`,
      actions: ['backupFiles:*'],
    });
  }

  async load() {
    this.app.resourcer.define(backupFilesResourcer);
  }

  async workerCreateBackUp(data: { dataTypes: string[]; appName: string; filename: string }) {
    await new Dumper(this.app).runDumpTask({
      groups: new Set(data.dataTypes) as Set<DumpRulesGroupType>,
      appName: data.appName,
      fileName: data.filename,
    });
  }
}
