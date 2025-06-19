'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const colors_1 = require('./colors');
function help() {
  // eslint-disable-next-line no-console
  console.log(`
  ${colors_1.pc.bold('pkg')} [options] <input>

  ${colors_1.pc.dim('Options:')}

    -h, --help           output usage information
    -v, --version        output pkg version
    -t, --targets        comma-separated list of targets (see examples)
    -c, --config         package.json or any json file with top-level config
    --options            bake v8 options into executable to run with them on
    -o, --output         output file name or template for several files
    --out-path           path to save output one or more executables
    -d, --debug          show more information during packaging process [off]
    -b, --build          don't download prebuilt base binaries, build them
    --public             speed up and disclose the sources of top-level project
    --public-packages    force specified packages to be considered public
    --no-bytecode        skip bytecode generation and include source files as plain js
    --no-native-build    skip native addons build
    --no-dict            comma-separated list of packages names to ignore dictionaries. Use --no-dict * to disable all dictionaries
    -C, --compress       [default=None] compression algorithm = Brotli or GZip
    --sea                (Experimental) compile give file using node's SEA feature. Requires node v20.0.0 or higher and only single file is supported

  ${colors_1.pc.dim('Examples:')}

  ${colors_1.pc.gray('–')} Makes executables for Linux, macOS and Windows
    ${colors_1.pc.cyan('$ pkg index.js')}
  ${colors_1.pc.gray('–')} Takes package.json from cwd and follows 'bin' entry
    ${colors_1.pc.cyan('$ pkg .')}
  ${colors_1.pc.gray('–')} Makes executable for particular target machine
    ${colors_1.pc.cyan('$ pkg -t node14-win-arm64 index.js')}
  ${colors_1.pc.gray('–')} Makes executables for target machines of your choice
    ${colors_1.pc.cyan('$ pkg -t node16-linux,node18-linux,node18-win index.js')}
  ${colors_1.pc.gray('–')} Bakes '--expose-gc' and '--max-heap-size=34' into executable
    ${colors_1.pc.cyan('$ pkg --options "expose-gc,max-heap-size=34" index.js')}
  ${colors_1.pc.gray('–')} Consider packageA and packageB to be public
    ${colors_1.pc.cyan('$ pkg --public-packages "packageA,packageB" index.js')}
  ${colors_1.pc.gray('–')} Consider all packages to be public
    ${colors_1.pc.cyan('$ pkg --public-packages "*" index.js')}
  ${colors_1.pc.gray('–')} Bakes '--expose-gc' into executable
    ${colors_1.pc.cyan('$ pkg --options expose-gc index.js')}
  ${colors_1.pc.gray('–')} reduce size of the data packed inside the executable with GZip
    ${colors_1.pc.cyan('$ pkg --compress GZip index.js')}
  ${colors_1.pc.gray('–')} compile the file using node's SEA feature. Creates executables for Linux, macOS and Windows
    ${colors_1.pc.cyan('$ pkg --sea index.js')}
`);
}
exports.default = help;
//# sourceMappingURL=help.js.map
