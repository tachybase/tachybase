import { Plugin } from '@tachybase/client';

import { StepFormCard } from './components/StepFormCard';
import { StepFormContainer } from './components/StepFormContainer';
import { useStepsFormCustomActionProps } from './hooks/useStepsFormCustomActionProps';
import { useStepsFormNextActionProps } from './hooks/useStepsFormNextActionProps';
import { useStepsFormPreviousActionProps } from './hooks/useStepsFormPreviousActionProps';
import { useStepsFormSubmitActionProps } from './hooks/useStepsFormSubmitActionProps';
import { stepFormActionInitializer } from './initializers/stepFormActionInitializer';
import { stepFormBlockInitializerItem } from './initializers/stepFormBlockInitializerItem';
import { stepNextSettings } from './settings/stepNext';
import { stepPreviousSettings } from './settings/stepPrevious';
import { stepsFormBlockSettings } from './settings/stepsForm';
import { stepTitleSettings } from './settings/stepTitle';

class PluginBlockStepFormClient extends Plugin {
  async load() {
    this.app.addComponents({
      StepFormCard,
      StepFormContainer,
    });

    this.app.addScopes({
      useStepsFormNextActionProps,
      useStepsFormPreviousActionProps,
      useStepsFormSubmitActionProps,
      useStepsFormCustomActionProps,
    });
    this.app.schemaSettingsManager.add(
      stepsFormBlockSettings,
      stepTitleSettings,
      stepPreviousSettings,
      stepNextSettings,
    );

    this.app.schemaInitializerManager.add(stepFormActionInitializer);

    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.stepForm', stepFormBlockInitializerItem);

    this.app.schemaInitializerManager.addItem(
      'popup:common:addBlock',
      'dataBlocks.stepForm',
      stepFormBlockInitializerItem,
    );
    this.app.schemaInitializerManager.addItem(
      'popup:addNew:addBlock',
      'dataBlocks.stepForm',
      stepFormBlockInitializerItem,
    );
  }
}

export default PluginBlockStepFormClient;
