import { Plugin } from '@tachybase/client';

import { StepsForm } from './components/StepsForm';
import { useStepsFormCustomActionProps } from './hooks/useStepsFormCustomActionProps';
import { useStepsFormNextActionProps } from './hooks/useStepsFormNextActionProps';
import { useStepsFormPreviousActionProps } from './hooks/useStepsFormPreviousActionProps';
import { useStepsFormSubmitActionProps } from './hooks/useStepsFormSubmitActionProps';
import { stepFormActionInitializer } from './initializers/stepFormActionInitializer';
import { stepFormBlockInitializerItem } from './initializers/stepFormBlockInitializerItem';
import { stepFormFieldsInitializer } from './initializers/stepFormFieldsInitializer';
import { stepNextSettings } from './settings/stepNext';
import { stepPreviousSettings } from './settings/stepPrevious';
import { stepsFormBlockSettings } from './settings/stepsForm';
import { stepTitleSettings } from './settings/stepTitle';

class PluginBlockStepFormClient extends Plugin {
  async load() {
    this.app.addComponents({
      StepsForm,
    });

    this.app.addScopes({
      useStepsFormNextActionProps,
      useStepsFormPreviousActionProps,
      useStepsFormSubmitActionProps,
      useStepsFormCustomActionProps,
    });

    this.app.schemaInitializerManager.add(stepFormFieldsInitializer, stepFormActionInitializer);
    this.app.schemaSettingsManager.add(
      stepTitleSettings,
      stepsFormBlockSettings,
      stepPreviousSettings,
      stepNextSettings,
    );

    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.stepForm', stepFormBlockInitializerItem);
  }
}

export default PluginBlockStepFormClient;
