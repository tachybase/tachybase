import { InjectedPlugin, Plugin } from '@tachybase/server';

import _ from 'lodash';

import { CloudLibrariesController } from './actions/cloud-libraries-controller';
import { CloudCompiler } from './services/cloud-compiler';
import { CloudLibrariesService } from './services/cloud-libraries-service';

@InjectedPlugin({
  Controllers: [CloudLibrariesController],
  Services: [CloudLibrariesService, CloudCompiler],
})
export class ModuleCloudComponentServer extends Plugin {}

export default ModuleCloudComponentServer;
