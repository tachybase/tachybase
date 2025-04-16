import { SchemaInitializer } from '@tachybase/client';

import { tval } from '../locale';

export const stepFormActionInitilizers = new SchemaInitializer({
  name: 'stepsForm:configureActions',
  title: tval('Configure actions', { ns: 'core' }),
  icon: 'SettingOutlined',
  items: [
    {
      type: 'itemGroup',
      title: tval('Enable actions'),
      name: 'enableActions',
      children: [],
    },
  ],
});
