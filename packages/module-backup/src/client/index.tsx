import { Plugin } from '@tachybase/client';

import { AutoBackupList } from './AutoBackup';
import { BackupAndRestoreList } from './Configuration';
import { AutoBackupTable } from './cron-jobs-table/AutoBackupTable';
import { DuplicatorProvider } from './DuplicatorProvider';
import { NAMESPACE } from './locale';

export class PluginBackupRestoreClient extends Plugin {
  async load() {
    this.app.use(DuplicatorProvider);
    this.app.systemSettingsManager.add('system-services.' + NAMESPACE, {
      title: this.t('Backup & Restore'),
      icon: 'CloudServerOutlined',
      sort: -50,
    });
    this.app.systemSettingsManager.add('system-services.' + NAMESPACE + '.files', {
      title: this.t('Backup file'),
      icon: 'CloudServerOutlined',
      Component: BackupAndRestoreList,
      aclSnippet: 'pm.backup.restore',
    });
    this.app.systemSettingsManager.add('system-services.' + NAMESPACE + '.auto', {
      title: this.t('Auto backup'),
      icon: 'CloudServerOutlined',
      Component: AutoBackupTable,
      aclSnippet: 'pm.backup.auto',
      sort: 20,
    });
  }
}

export default PluginBackupRestoreClient;
