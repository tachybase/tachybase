import { NodeTarget, Target } from './types';
export type GetNodejsExecutableOptions = {
    useLocalNode?: boolean;
    nodePath?: string;
};
export type SeaConfig = {
    disableExperimentalSEAWarning: boolean;
    useSnapshot: boolean;
    useCodeCache: boolean;
    assets?: Record<string, string>;
};
export type SeaOptions = {
    seaConfig?: SeaConfig;
    signature?: boolean;
    targets: (NodeTarget & Partial<Target>)[];
} & GetNodejsExecutableOptions;
/** Create NodeJS executable using sea */
export default function sea(entryPoint: string, opts: SeaOptions): Promise<void>;
//# sourceMappingURL=sea.d.ts.map