import { Service, Db } from '@nocobase/utils';
import Database from '@nocobase/database';

@Service()
export class SystemSettingService {
  @Db()
  private db: Database;

  async get(): Promise<SystemSetting> {
    return await this.db.getRepository('systemSettings').findOne({ filter: { id: 1 } });
  }
}
