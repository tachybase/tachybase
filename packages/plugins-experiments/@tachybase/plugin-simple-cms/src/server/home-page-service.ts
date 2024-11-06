import Database from '@tachybase/database';
import Application from '@tachybase/server';
import { App, Db, Service } from '@tachybase/utils';

@Service()
export class HomePageService {
  @App()
  private app: Application;

  @Db()
  private db: Database;

  async install() {
    this.app.acl.allow('home_page_presentations', 'list', 'public');
    const repo = this.db.getRepository<any>('collections');
    if (repo) {
      await repo.db2cm('home_page_presentations');
    }
  }
}
