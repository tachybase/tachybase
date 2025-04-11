import { Migration } from '@tachybase/server';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<1.0.4';

  async up() {
    // coding
    if (this.app.name === 'main') {
      return;
    }
  }
}
