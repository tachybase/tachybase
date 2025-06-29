import { buildCjs } from '../../build/buildCjs';
import { buildClient } from '../../build/buildClient';
import { buildEsm } from '../../build/buildEsm';
import { CORE_CLIENT, ESM_PACKAGES } from '../../build/constant';
import { getPkgLog, getUserConfig } from '../../build/utils';
import { IBuildablePackage, IBuildContext } from '../interfaces';

export class LibPackage implements IBuildablePackage {
  static name = 'lib';
  name: string;
  dir: string;
  context: IBuildContext;
  isEsm: boolean = false;
  isClient: boolean = false;

  constructor(name: string, dir: string, context: IBuildContext) {
    this.name = name;
    this.dir = dir;
    this.context = context;

    this.isEsm = ESM_PACKAGES.includes(this.name);
    this.isClient = this.dir === CORE_CLIENT;
  }
  async build() {
    const log = getPkgLog(this.name);
    log('building...');

    const userConfig = getUserConfig(this.dir);
    if (userConfig.beforeBuild) {
      log('beforeBuild');
      await userConfig.beforeBuild(log);
    }

    if (!this.isClient) {
      // client should skip
      await buildCjs(this.dir, userConfig, this.context.sourcemap, log);
    }
    if (this.isClient) {
      await buildClient(this.dir, userConfig, this.context.sourcemap, log);
    }
    if (this.isEsm) {
      await buildEsm(this.dir, userConfig, this.context.sourcemap, log);
    }

    if (userConfig.afterBuild) {
      log('afterBuild');
      await userConfig.afterBuild(log);
    }

    log('done');
  }
}
