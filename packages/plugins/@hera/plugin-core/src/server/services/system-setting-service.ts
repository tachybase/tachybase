import { Service, Db } from '@tachybase/utils';
import Database from '@tachybase/database';

export interface SystemSetting {
  title: string;
}

@Service()
export class SystemSettingService {
  @Db()
  private db: Database;

  async get(): Promise<SystemSetting> {
    return await this.db.getRepository('systemSettings').findOne({ filter: { id: 1 } });
  }
}
