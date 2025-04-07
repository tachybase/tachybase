import { Migration } from '@tachybase/server';

import { tokenPolicyCollectionName, tokenPolicyRecordKey } from '../../constants';

export default class extends Migration {
  on = 'afterLoad'; // 'beforeLoad' or 'afterLoad'
  appVersion = '<0.23.66';

  async up() {
    const tokenPolicyRepo = this.app.db.getRepository(tokenPolicyCollectionName);
    const tokenPolicy = await tokenPolicyRepo.findOne({ filterByTk: tokenPolicyRecordKey });
    if (tokenPolicy) {
      this.app.authManager.tokenController.setConfig(tokenPolicy.config);
    } else {
      const config = {
        tokenExpirationTime: '1d',
        sessionExpirationTime: '7d',
        expiredTokenRenewLimit: '1d',
      };
      await tokenPolicyRepo.create({
        values: {
          key: tokenPolicyRecordKey,
          config,
        },
      });
      this.app.authManager.tokenController.setConfig(config);
    }
  }
}
