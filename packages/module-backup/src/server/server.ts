import { isMainThread } from 'worker_threads';
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

    this.app.registerWorker?.(this.name);
  }

  async load() {
    this.app.resourcer.define(backupFilesResourcer);
  }

  async workerCreateBackUp(data: { dataTypes: string[] }) {
    const dumper = new Dumper(this.app);

    return dumper.runDumpTask({
      groups: new Set(data.dataTypes) as Set<DumpRulesGroupType>,
    });
  }
}
