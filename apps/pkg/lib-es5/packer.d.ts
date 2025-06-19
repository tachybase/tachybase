/// <reference types="node" />
/// <reference types="node" />
import { FileRecords, SymLinks } from './types';

interface PackerOptions {
  records: FileRecords;
  entrypoint: string;
  bytecode: boolean;
  symLinks: SymLinks;
}
export interface Stripe {
  snap: string;
  skip?: boolean;
  store: number;
  file?: string;
  buffer?: Buffer;
}
export default function packer({ records, entrypoint, bytecode }: PackerOptions): {
  prelude: string;
  entrypoint: string;
  stripes: Stripe[];
};
export {};
//# sourceMappingURL=packer.d.ts.map
