import { FileRecord, FileRecords, PackageJson, SymLinks } from './types';

export interface Marker {
  hasDictionary?: boolean;
  activated?: boolean;
  toplevel?: boolean;
  public?: boolean;
  hasDeployFiles?: boolean;
  config?: PackageJson;
  configPath: string;
  base: string;
}
interface Task {
  file: string;
  data?: unknown;
  reason?: string;
  marker?: Marker;
  store: number;
}
interface Derivative {
  alias: string;
  mayExclude?: boolean;
  mustExclude?: boolean;
  aliasType: number;
  fromDependencies?: boolean;
}
export interface WalkerParams {
  publicToplevel?: boolean;
  publicPackages?: string[];
  noDictionary?: string[];
}
declare class Walker {
  private params;
  private symLinks;
  private patches;
  private tasks;
  private records;
  private dictionary;
  constructor();
  appendRecord({ file, store }: Task): void;
  private append;
  appendSymlink(file: string, realFile: string): Promise<void>;
  appendStat(task: Task): void;
  appendFileInFolder(task: Task): void;
  appendBlobOrContent(task: Task): Promise<void>;
  appendFilesFromConfig(marker: Marker): Promise<void>;
  stepActivate(marker: Marker, derivatives: Derivative[]): Promise<void>;
  hasPatch(record: FileRecord): true | undefined;
  stepPatch(record: FileRecord): void;
  stepDerivatives_ALIAS_AS_RELATIVE(record: FileRecord, marker: Marker, derivative: Derivative): Promise<void>;
  stepDerivatives_ALIAS_AS_RESOLVABLE(record: FileRecord, marker: Marker, derivative: Derivative): Promise<void>;
  stepDerivatives(record: FileRecord, marker: Marker, derivatives: Derivative[]): Promise<void>;
  step_STORE_ANY(record: FileRecord, marker: Marker, store: number): Promise<void>;
  step_STORE_LINKS(record: FileRecord, data: unknown): void;
  step_STORE_STAT(record: FileRecord): Promise<void>;
  step(task: Task): Promise<void>;
  readDictionary(marker: Marker): Promise<void>;
  start(
    marker: Marker,
    entrypoint: string,
    addition: string | undefined,
    params: WalkerParams,
  ): Promise<{
    symLinks: SymLinks;
    records: FileRecords;
    entrypoint: string;
  }>;
}
export default function walker(...args: Parameters<Walker['start']>): Promise<{
  symLinks: SymLinks;
  records: FileRecords;
  entrypoint: string;
}>;
export {};
//# sourceMappingURL=walker.d.ts.map
