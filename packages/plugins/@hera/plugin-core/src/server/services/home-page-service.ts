import Application from '@tachybase/server';
import { Service, App, Db } from '@tachybase/utils';
import Database from '@tachybase/database';

@Service()
export class HomePageService {
  @App()
  private app: Application;

  @Db()
  private db: Database;

  async load() {
    this.app.acl.allow('home_page_presentations', 'list', 'public');
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('home_page_presentations');
    }
  }
}
