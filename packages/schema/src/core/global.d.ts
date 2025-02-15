import * as Models from './models';
import * as Types from './types';

declare global {
  namespace Formily.Core {
    export { Types, Models };
  }
}
