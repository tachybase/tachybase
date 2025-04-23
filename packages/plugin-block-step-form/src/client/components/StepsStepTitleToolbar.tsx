import { SchemaToolbar } from '@tachybase/client';

import { stepTitleSettings } from '../settings/stepTitle';

// TODO: 移动位置, 另外归类
export const StepsStepTitleToolbar = () => {
  return <SchemaToolbar draggable={true} initializer={false} settings={stepTitleSettings.name} />;
};
