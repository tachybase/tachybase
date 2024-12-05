import { Model, Transactionable } from '@tachybase/database';
import { Application } from '@tachybase/server';
import { merge } from '@tachybase/utils';

import mergeApplicationStartEnvs from '../app-start-env';
import { AppOptionsFactory } from '../server';

export interface registerAppOptions extends Transactionable {
  skipInstall?: boolean;
  appOptionsFactory: AppOptionsFactory;
}

export class ApplicationModel extends Model {
  registerToSupervisor(mainApp: Application, options: registerAppOptions) {
    const appName = this.get('name') as string;
    const preset = this.get('preset') as string;
    const tmpl = this.get('tmpl') as string;
    const appModelOptions = (this.get('options') as any) || {};
    const startEnvs = appModelOptions.startEnvs || {};

    let appOptions = options.appOptionsFactory(appName, mainApp, preset);
    appOptions = mergeApplicationStartEnvs(appName, mainApp, appOptions, startEnvs);

    const subAppOptions = {
      ...(merge(appOptions, appModelOptions) as object),
      name: appName,
      tmpl,
    };

    return new Application(subAppOptions);
  }
}
