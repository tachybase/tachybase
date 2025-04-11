import React, { Suspense } from 'react';
import { Plugin } from '@tachybase/client';

import { Skeleton } from 'antd';

import { lang } from './locale';

const StepFormBlockInitializer = React.lazy(() => import('./StepFormBlockInitializer'));

const StepFormContainer = React.lazy(() => import('./StepFormContainer'));

class PluginBlockStepFormClient extends Plugin {
  async load() {
    this.app.addComponents({
      StepFormContainer: () => (
        <Suspense fallback={<Skeleton.Button active />}>
          <StepFormContainer />
        </Suspense>
      ),
    });
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
