import { Channel } from '../../../interface';
import { lang } from '../../../locale';

export const SMS_CHANNEL = 'sms';
export class SMSChannel extends Channel {
  name = SMS_CHANNEL;
  title = lang('SMS notification');
  isServer = true;
}
