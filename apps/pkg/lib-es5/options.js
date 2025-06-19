"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Options {
    constructor() {
        this.options = {
            dictionary: {},
        };
    }
    set(options) {
        this.options = options !== null && options !== void 0 ? options : this.options;
    }
    get() {
        return this.options;
    }
}
const options = new Options();
exports.default = options;
//# sourceMappingURL=options.js.map