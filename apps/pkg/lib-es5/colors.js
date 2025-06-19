'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.pc = void 0;
const picocolors_1 = __importDefault(require('picocolors'));
const tty_1 = require('tty');
// makes color detection more accurate using node's own API for it
// https://github.com/alexeyraspopov/picocolors/issues/85
exports.pc = picocolors_1.default.createColors(tty_1.WriteStream.prototype.hasColors());
//# sourceMappingURL=colors.js.map
