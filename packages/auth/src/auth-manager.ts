import { Context, Next } from '@tachybase/actions';
import { Registry } from '@tachybase/utils';

import { Auth, AuthExtend } from './auth';
import { JwtOptions, JwtService } from './base/jwt-service';
import { ITokenBlacklistService } from './base/token-blacklist-service';
import { ITokenControlService } from './base/token-control-service';

export interface Authenticator {
  authType: string;
  options: Record<string, any>;
  [key: string]: any;
}

export interface Storer {
  get: (name: string) => Promise<Authenticator>;
}

export type AuthManagerOptions = {
  authKey: string;
  default?: string;
  jwt?: JwtOptions;
};

type AuthConfig = {
  auth: AuthExtend<Auth>; // The authentication class.
  title?: string; // The display name of the authentication type.
  getPublicOptions?: (options: Record<string, any>) => Record<string, any>; // Get the public options.
};

export class AuthManager {
  jwt: JwtService;
  tokenController: ITokenControlService;

  protected options: AuthManagerOptions;
  protected authTypes: Registry<AuthConfig> = new Registry();
  // authenticators collection manager.
  protected storer: Storer;

  constructor(options: AuthManagerOptions) {
    this.options = options;
    this.jwt = new JwtService(options.jwt);
  }

  setStorer(storer: Storer) {
    this.storer = storer;
  }

  setTokenBlacklistService(service: ITokenBlacklistService) {
    this.jwt.blacklist = service;
  }

  setTokenControlService(service: ITokenControlService) {
    this.tokenController = service;
  }

  /**
   * registerTypes
   * @description Add a new authenticate type and the corresponding authenticator.
   * The types will show in the authenticators list of the admin panel.
   *
   * @param authType - The type of the authenticator. It is required to be unique.
   * @param authConfig - Configurations of the kind of authenticator.
   */
  registerTypes(authType: string, authConfig: AuthConfig) {
    this.authTypes.register(authType, authConfig);
  }

  listTypes() {
    return Array.from(this.authTypes.getEntities()).map(([authType, authConfig]) => ({
      name: authType,
      title: authConfig.title,
    }));
  }

  getAuthConfig(authType: string) {
    return this.authTypes.get(authType);
  }

  /**
   * get
   * @description Get authenticator instance by name.
   * @param name - The name of the authenticator.
   * @return authenticator instance.
   */
  async get(name: string, ctx: Context) {
    if (!this.storer) {
      throw new Error('AuthManager.storer is not set.');
    }
    const authenticator = await this.storer.get(name);
    if (!authenticator) {
      throw new Error(`Authenticator [${name}] is not found.`);
    }
    const { auth } = this.authTypes.get(authenticator.authType);
    if (!auth) {
      throw new Error(`AuthType [${name}] is not found.`);
    }
    return new auth({ authenticator, options: authenticator.options, ctx });
  }

  /**
   * middleware
   * @description Auth middleware, used to check the user status.
   */
  middleware() {
    const self = this;

    return async function AuthManagerMiddleware(ctx: Context & { auth: Auth }, next: Next) {
      const name = ctx.get(self.options.authKey) || self.options.default;
      let authenticator: Auth;
      try {
        authenticator = await ctx.app.authManager.get(name, ctx);
        ctx.auth = authenticator;
      } catch (err) {
        ctx.auth = {} as Auth;
        ctx.logger.warn(err.message, { method: 'check', authenticator: name });
        return next();
      }

      if (!authenticator) {
        return next();
      }

      if (await ctx.auth.skipCheck()) {
        return next();
      }

      const user = await ctx.auth.check();
      if (user) {
        ctx.auth.user = user;
      }
      await next();
    };
  }
  async getOptions(name: string) {
    const authenticator = await this.storer.get(name);
    return authenticator.options;
  }
}
