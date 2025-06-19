import { SyncOpts } from 'resolve';

import type { PackageJson } from './types';

interface FollowOptions extends Pick<SyncOpts, 'basedir' | 'extensions'> {
  ignoreFile?: string;
  catchReadFile?: (file: string) => void;
  catchPackageFilter?: (config: PackageJson, base: string, dir: string) => void;
}
export declare function follow(x: string, opts: FollowOptions): Promise<string>;
export {};
//# sourceMappingURL=follow.d.ts.map
