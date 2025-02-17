import { DataSource } from './data-source';
import { DataSourceManager } from './data-source-manager';

export class DataSourceFactory {
  public collectionTypes: Map<string, typeof DataSource> = new Map();

  constructor(protected dataSourceManager: DataSourceManager) {}

  register(type: string, dataSourceClass: typeof DataSource) {
    this.collectionTypes.set(type, dataSourceClass);
  }

  getClass(type: string): typeof DataSource {
    return this.collectionTypes.get(type);
  }

  create(type: string, options: any = {}): DataSource {
    const klass = this.collectionTypes.get(type);
    if (!klass) {
      throw new Error(`Data source type "${type}" not found`);
    }
    const environment = this.dataSourceManager.options.app?.environment;
    const { logger, sqlLogger, ...others } = options;

    const opts = { logger, sqlLogger, ...others };

    if (environment) {
      Object.assign(opts, environment.renderJsonTemplate(others));
    }
    // @ts-ignore
    const dataSource = new klass(opts) as DataSource;
    dataSource.setDataSourceManager(this.dataSourceManager);
    return dataSource;
  }
}
