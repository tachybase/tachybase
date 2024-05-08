import { ISchema } from '@tachybase/schema';
import { Registry } from '@tachybase/utils/client';
import SMSAliyun from './sms-aliyun';
import SMSTencent from './sms-tencent';

const providerTypes: Registry<ISchema> = new Registry();

providerTypes.register('sms-aliyun', SMSAliyun);
providerTypes.register('sms-tencent', SMSTencent);

export default providerTypes;
