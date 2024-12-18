import { Channel } from '../../../interface';
import { lang } from '../../../locale';

export const EMAIL_CHANNEL = 'email';
export class EmailChannel extends Channel {
  name = EMAIL_CHANNEL;
  title = lang('Email notify');
}
