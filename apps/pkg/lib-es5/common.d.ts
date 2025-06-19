/// <reference types="node" />
/// <reference types="node" />
export declare const STORE_BLOB = 0;
export declare const STORE_CONTENT = 1;
export declare const STORE_LINKS = 2;
export declare const STORE_STAT = 3;
export declare const ALIAS_AS_RELATIVE = 0;
export declare const ALIAS_AS_RESOLVABLE = 1;
export declare function isRootPath(p: string | URL | Buffer): boolean;
export declare function normalizePath(f: string | URL | Buffer): string;
export declare function isPackageJson(file: string): boolean;
export declare function isDotJS(file: string): boolean;
export declare function isDotJSON(file: string): boolean;
export declare function isDotNODE(file: string): boolean;
export declare function retrieveDenominator(files: string[]): number;
export declare function substituteDenominator(f: string, denominator: number): string;
export declare function snapshotify(file: string, slash: string): string;
export declare function insideSnapshot(f: Buffer | string | URL): boolean;
export declare function stripSnapshot(f: string): string;
export declare function removeUplevels(f: string): string;
export declare function toNormalizedRealPath(requestPath: string): string;
//# sourceMappingURL=common.d.ts.map
