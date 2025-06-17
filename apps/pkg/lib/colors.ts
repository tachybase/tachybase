import picocolors from 'picocolors';
import { WriteStream } from 'node:tty';

// makes color detection more accurate using node's own API for it
// https://github.com/alexeyraspopov/picocolors/issues/85
export const pc = picocolors.createColors(WriteStream.prototype.hasColors());
