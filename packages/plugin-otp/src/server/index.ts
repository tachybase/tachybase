import { name } from '../../package.json';

export { default } from './Plugin';
export type { Interceptor } from './Plugin';
export * from './constants';
export { Provider } from './providers/Provider';

export const namespace = name;
