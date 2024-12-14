import actions from '@tachybase/actions';

import { MESSAGES_UPDATE_BADGE_COUNT } from '../../common/constants';

export const messages = {
  async update(context, next) {
    await actions.update(context, next);

    context.app.noticeManager.notify(MESSAGES_UPDATE_BADGE_COUNT, {
      msg: MESSAGES_UPDATE_BADGE_COUNT,
    });
  },
};
