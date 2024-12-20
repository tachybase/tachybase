import { ISchema } from '@tachybase/schema';
import { Registry } from '@tachybase/utils/client';

import SMSAliyun from './sms-aliyun';
import SMSTencent from './sms-tencent';

const providerTypes: Registry<ISchema> = new Registry();

export const SMS_PROVIDER_ALIYUN = 'sms-aliyun';
const SMS_PROVIDER_TENCENT = 'sms-tencent';

providerTypes.register(SMS_PROVIDER_ALIYUN, SMSAliyun);
providerTypes.register(SMS_PROVIDER_TENCENT, SMSTencent);

export default providerTypes;
