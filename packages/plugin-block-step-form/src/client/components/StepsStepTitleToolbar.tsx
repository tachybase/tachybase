import { SchemaToolbar } from '@tachybase/client';

export const StepsStepTitleToolbar = () => {
  return <SchemaToolbar draggable={true} initializer={false} settings="settings:stepsFormStepTitleSettings" />;
};
