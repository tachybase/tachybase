import fsPromises from 'fs/promises';
import { DumpRulesGroupType } from '@tachybase/database';
import { Application, AppSupervisor } from '@tachybase/server';

import { Dumper } from '../dumper';

export default function addBackupCommand(app: Application) {
  app
    .command('backup')
    .ipc()
    .option('-a, --app <appName>', 'sub app name if you want to backup')
    .option(
      '-g, --groups <groups>',
      'groups to backup',
      (value, previous) => {
        return previous.concat([value]);
      },
      [],
    )
    .action(async (options) => {
      let backupApp = app;
      if (options.app) {
        if (
          !(await app.db.getCollection('applications').repository.findOne({
            filter: { name: options.app },
          }))
        ) {
          // create sub app if not exists
          await app.db.getCollection('applications').repository.create({
            values: {
              name: options.app,
            },
          });
        }

        const subApp = await AppSupervisor.getInstance().getApp(options.app);

        if (!subApp) {
          app.logger.error(`app ${options.app} not found`);
          await app.stop();
          return;
        }

        backupApp = subApp;
      }

      const groups: Set<string> = new Set<DumpRulesGroupType>(options.groups);
      groups.add('required');

      const dumper = new Dumper(app);

      const appName = backupApp.name;
      const backupFileName = Dumper.generateFileName();
      const tmpFile = await dumper.writeLockFile(backupFileName, appName);
      await dumper.runDumpTask({
        groups,
        appName,
        fileName: backupFileName,
      });
      await fsPromises.unlink(tmpFile);
      backupApp.logger.info(`${appName} backup into ${backupFileName}!`);
    });
}
