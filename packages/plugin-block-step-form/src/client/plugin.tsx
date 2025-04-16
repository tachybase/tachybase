import React, { Suspense } from 'react';
import { Plugin } from '@tachybase/client';

import { Skeleton } from 'antd';

import { stepFormActionInitilizers } from './initializers/stepFormActionInitializers';
import { lang } from './locale';

const StepFormBlockInitializer = React.lazy(() => import('./StepFormBlockInitializer'));

const StepFormContainer = React.lazy(() => import('./components/StepFormContainer'));

class PluginBlockStepFormClient extends Plugin {
  async load() {
    this.app.addComponents({
      StepFormContainer: () => (
        <Suspense fallback={<Skeleton.Button active />}>
          <StepFormContainer />
        </Suspense>
      ),
    });
    // TODO: 添加步骤初始化器, 动作初始化器, 表单字段初始化器
    this.app.schemaInitializerManager.add(stepFormActionInitilizers);
    // TODO: 添加步骤设置器, 动作设置器
    this.app.schemaSettingsManager.add();

    const blockInitializers = this.app.schemaInitializerManager.get('page:addBlock');

    blockInitializers?.add('dataBlocks.stepForm', {
      title: lang('Step form'),
      Component: () => (
        <Suspense fallback={<Skeleton.Button active />}>
          <StepFormBlockInitializer />
        </Suspense>
      ),
    });
  }
}

export default PluginBlockStepFormClient;
