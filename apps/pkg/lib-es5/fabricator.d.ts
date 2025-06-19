/// <reference types="node" />
/// <reference types="node" />
import { Target } from './types';
export declare function fabricate(bakes: string[], fabricator: Target, snap: string, body: Buffer, cb: (error?: Error, buffer?: Buffer) => void): void;
export declare function fabricateTwice(bakes: string[], fabricator: Target, snap: string, body: Buffer, cb: (error?: Error, buffer?: Buffer) => void): void;
export declare function shutdown(): void;
//# sourceMappingURL=fabricator.d.ts.map