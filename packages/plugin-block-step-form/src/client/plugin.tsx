import React, { Suspense } from 'react';
import { Plugin } from '@tachybase/client';

import { Skeleton } from 'antd';

import { StepsForm } from './components/StepsForm';
import { useStepsFormCustomActionProps } from './hooks/useStepsFormCustomActionProps';
import { useStepsFormNextActionProps } from './hooks/useStepsFormNextActionProps';
import { useStepsFormPreviousActionProps } from './hooks/useStepsFormPreviousActionProps';
import { useStepsFormSubmitActionProps } from './hooks/useStepsFormSubmitActionProps';
import { stepFormActionInitializer } from './initializers/stepFormActionInitializer';
import { stepFormBlockInitializerItem } from './initializers/stepFormBlockInitializerItem';
import { stepNextSettings } from './settings/stepNext';
import { stepsFormBlockSettings } from './settings/stepsForm.block';

// const StepFormBlockInitializer = React.lazy(() => import('./StepFormBlockInitializer'));

// const StepFormContainer = React.lazy(() => import('./components/StepFormContainer'));

// StepsForm: () => (
//   <Suspense fallback={<Skeleton.Button active />}>
//     <StepFormContainer />
//   </Suspense>
// ),

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
    // TODO: 添加步骤初始化器, 动作初始化器, 表单字段初始化器
    this.app.schemaInitializerManager.add(stepFormActionInitializer);
    // TODO: 添加步骤设置器, 动作设置器
    this.app.schemaSettingsManager.add(stepsFormBlockSettings, stepNextSettings);

    this.app.schemaInitializerManager.addItem('page:addBlock', 'dataBlocks.stepForm', stepFormBlockInitializerItem);

    // this.app.router.add('admin.step-form', {
    //   path: '/admin/step-form',
    //   Component: () => {
    //     return (
    //       <div>
    //        <StepsForm />
    //       </div>
    //     );
    //   },
    // });

    // this.app.schemaInitializerManager.get('page:addBlock')?.add('dataBlocks.stepForm', {
    //   title: lang('Step form'),
    //   Component: () => (
    //     <Suspense fallback={<Skeleton.Button active />}>
    //       <StepFormBlockInitializer />
    //     </Suspense>
    //   ),
    // });
  }
}

export default PluginBlockStepFormClient;
