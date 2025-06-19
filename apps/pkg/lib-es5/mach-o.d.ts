/// <reference types="node" />
/// <reference types="node" />
/**
 * It would be nice to explain the purpose of this patching function
 * @param file
 * @returns
 */
declare function patchMachOExecutable(file: Buffer): Buffer;
declare function signMachOExecutable(executable: string): void;
declare function removeMachOExecutableSignature(executable: string): void;
export { patchMachOExecutable, removeMachOExecutableSignature, signMachOExecutable, };
//# sourceMappingURL=mach-o.d.ts.map