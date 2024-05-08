import { Plugin, SchemaInitializerItemType } from '@tachybase/client';
import { AuditLogsProvider } from './AuditLogsProvider';
import { auditLogsTableActionColumnInitializers } from './initializers/AuditLogsTableActionColumnInitializers';
import { auditLogsTableActionInitializers } from './initializers/AuditLogsTableActionInitializers';
import { auditLogsTableColumnInitializers } from './initializers/AuditLogsTableColumnInitializers';
import { tval } from './locale';
export * from './AuditLogsBlockInitializer';
export * from './AuditLogsProvider';

export class AuditLogsPlugin extends Plugin {
  async load() {
    this.app.use(AuditLogsProvider);
    this.app.schemaInitializerManager.add(auditLogsTableActionInitializers);
    this.app.schemaInitializerManager.add(auditLogsTableActionColumnInitializers);
    this.app.schemaInitializerManager.add(auditLogsTableColumnInitializers);

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');
    const recordBlockInitializers = this.app.schemaInitializerManager.get('popup:common:addBlock');
    const auditLogs: Omit<SchemaInitializerItemType, 'name'> = {
      title: tval('Audit logs'),
      Component: 'AuditLogsBlockInitializer',
    };
    blockInitializers.add('otherBlocks.auditLogs', auditLogs);
    recordBlockInitializers.add('otherBlocks.auditLogs', auditLogs);
  }
}

export default AuditLogsPlugin;
