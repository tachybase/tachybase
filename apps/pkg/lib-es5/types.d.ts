/// <reference types="node" />
/// <reference types="node" />
import type { log } from './log';
export interface FileRecord {
    file: string;
    body?: Buffer | string;
    [key: number]: any;
}
export type FileRecords = Record<string, FileRecord>;
type License = string | {
    type: string;
};
export type Patches = Record<string, string & {
    do: 'erase' | 'prepend' | 'append';
}[]>;
export type ConfigDictionary = Record<string, {
    pkg?: {
        dependencies?: Record<string, string>;
    };
    dependencies?: Record<string, string>;
}>;
export interface PkgOptions {
    scripts?: string[];
    log?: (logger: typeof log, context: Record<string, string>) => void;
    assets?: string[];
    ignore?: string[];
    deployFiles?: string[];
    patches?: Patches;
    dictionary: ConfigDictionary;
}
export interface PackageJson {
    name?: string;
    private?: boolean;
    licenses?: License;
    license?: License;
    main?: string;
    dependencies?: Record<string, string>;
    files?: string[];
    pkg?: PkgOptions;
}
export declare const platform: {
    macos: string;
    win: string;
    linux: string;
};
export interface NodeTarget {
    nodeRange: string;
    arch: string;
    platform: keyof typeof platform;
    forceBuild?: boolean;
}
export interface Target extends NodeTarget {
    binaryPath: string;
    output: string;
    fabricator: Target;
}
export type SymLinks = Record<string, string>;
export {};
//# sourceMappingURL=types.d.ts.map