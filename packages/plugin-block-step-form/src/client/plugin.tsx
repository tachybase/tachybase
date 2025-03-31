import React, { Suspense } from 'react';
import { Plugin } from '@tachybase/client';

import { Skeleton } from 'antd';

import { lang } from './locale';

const StepFormBlockInitializer = React.lazy(() => import('./StepFormBlockInitializer'));

class PluginBlockStepFormClient extends Plugin {
  async load() {
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
