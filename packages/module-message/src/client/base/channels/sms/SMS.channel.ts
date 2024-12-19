import { CHANNEL_SITE_SMS } from '../../../../common/constants';
import { Channel } from '../../../interface';
import { lang } from '../../../locale';

export const SMS_CHANNEL = CHANNEL_SITE_SMS;
export class SMSChannel extends Channel {
  name = SMS_CHANNEL;
  title = lang('Text Message Alerts');
}
