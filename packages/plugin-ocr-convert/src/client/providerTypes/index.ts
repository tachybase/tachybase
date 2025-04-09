import { ISchema } from '@tachybase/schema';
import { Registry } from '@tachybase/utils/client';

import TencentCloudOcr from './tencent-cloud';

const providerTypes: Registry<ISchema> = new Registry();

providerTypes.register('tencent-cloud', TencentCloudOcr);

export default providerTypes;
