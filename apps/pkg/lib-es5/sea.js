'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const child_process_1 = require('child_process');
const util_1 = __importDefault(require('util'));
const path_1 = require('path');
const promises_1 = require('fs/promises');
const fs_1 = require('fs');
const promises_2 = require('stream/promises');
const crypto_1 = require('crypto');
const os_1 = require('os');
const unzipper_1 = __importDefault(require('unzipper'));
const tar_1 = require('tar');
const log_1 = require('./log');
const mach_o_1 = require('./mach-o');
const exec = util_1.default.promisify(child_process_1.exec);
/** Returns stat of path when exits, false otherwise */
const exists = async (path) => {
  try {
    return await (0, promises_1.stat)(path);
  } catch (_a) {
    return false;
  }
};
const defaultSeaConfig = {
  disableExperimentalSEAWarning: true,
  useSnapshot: false,
  useCodeCache: false,
};
/** Download a file from a given URL and save it to `filePath` */
async function downloadFile(url, filePath) {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    throw new Error(`Failed to download file from ${url}`);
  }
  const fileStream = (0, fs_1.createWriteStream)(filePath);
  return (0, promises_2.pipeline)(response.body, fileStream);
}
/** Extract node executable from the archive */
async function extract(os, archivePath) {
  const nodeDir = (0, path_1.basename)(archivePath, os === 'win' ? '.zip' : '.tar.gz');
  const archiveDir = (0, path_1.dirname)(archivePath);
  let nodePath = '';
  if (os === 'win') {
    // use unzipper to extract the archive
    const { files } = await unzipper_1.default.Open.file(archivePath);
    const nodeBinPath = `${nodeDir}/node.exe`;
    const nodeBin = files.find((file) => file.path === nodeBinPath);
    if (!nodeBin) {
      throw new Error('Node executable not found in the archive');
    }
    nodePath = (0, path_1.join)(archiveDir, `${nodeDir}.exe`);
    // extract the node executable
    await (0, promises_2.pipeline)(nodeBin.stream(), (0, fs_1.createWriteStream)(nodePath));
  } else {
    const nodeBinPath = `${nodeDir}/bin/node`;
    // use tar to extract the archive
    await (0, tar_1.extract)({
      file: archivePath,
      cwd: archiveDir,
      filter: (path) => path === nodeBinPath,
    });
    // check if the node executable exists
    nodePath = (0, path_1.join)(archiveDir, nodeBinPath);
  }
  // check if the node executable exists
  if (!(await exists(nodePath))) {
    throw new Error('Node executable not found in the archive');
  }
  return nodePath;
}
/** Verify the checksum of downloaded NodeJS archive */
async function verifyChecksum(filePath, checksumUrl, fileName) {
  var _a;
  const response = await fetch(checksumUrl);
  if (!response.ok) {
    throw new Error(`Failed to download checksum file from ${checksumUrl}`);
  }
  const checksums = await response.text();
  const expectedChecksum =
    (_a = checksums.split('\n').find((line) => line.includes(fileName))) === null || _a === void 0
      ? void 0
      : _a.split(' ')[0];
  if (!expectedChecksum) {
    throw new Error(`Checksum for ${fileName} not found`);
  }
  const fileBuffer = await (0, promises_1.readFile)(filePath);
  const hashSum = (0, crypto_1.createHash)('sha256');
  hashSum.update(fileBuffer);
  const actualChecksum = hashSum.digest('hex');
  if (actualChecksum !== expectedChecksum) {
    throw new Error(`Checksum verification failed for ${fileName}`);
  }
}
/** Get the node os based on target platform */
function getNodeOs(platform) {
  const allowedOSs = ['darwin', 'linux', 'win'];
  const platformsMap = {
    macos: 'darwin',
  };
  const validatedPlatform = platformsMap[platform] || platform;
  if (!allowedOSs.includes(validatedPlatform)) {
    throw new Error(`Unsupported OS: ${platform}`);
  }
  return validatedPlatform;
}
/** Get the node arch based on target arch */
function getNodeArch(arch) {
  const allowedArchs = ['x64', 'arm64', 'armv7l', 'ppc64', 's390x', 'riscv64', 'loong64'];
  if (!allowedArchs.includes(arch)) {
    throw new Error(`Unsupported architecture: ${arch}`);
  }
  return arch;
}
/** Get latest node version based on the provided partial version */
async function getNodeVersion(os, arch, nodeVersion) {
  // validate nodeVersion using regex. Allowed formats: 16, 16.0, 16.0.0
  const regex = /^\d{1,2}(\.\d{1,2}){0,2}$/;
  if (!regex.test(nodeVersion)) {
    throw new Error('Invalid node version format');
  }
  const parts = nodeVersion.split('.');
  if (parts.length > 3) {
    throw new Error('Invalid node version format');
  }
  if (parts.length === 3) {
    return nodeVersion;
  }
  let url;
  switch (arch) {
    case 'riscv64':
    case 'loong64':
      url = 'https://unofficial-builds.nodejs.org/download/release/index.json';
      break;
    default:
      url = 'https://nodejs.org/dist/index.json';
      break;
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch node versions');
  }
  const versions = await response.json();
  const nodeOS = os === 'darwin' ? 'osx' : os;
  const latestVersionAndFiles = versions
    .map((v) => [v.version, v.files])
    .find(([v, files]) => v.startsWith(`v${nodeVersion}`) && files.find((f) => f.startsWith(`${nodeOS}-${arch}`)));
  if (!latestVersionAndFiles) {
    throw new Error(`Node version ${nodeVersion} not found`);
  }
  return latestVersionAndFiles[0];
}
/** Fetch, validate and extract nodejs binary. Returns a path to it */
async function getNodejsExecutable(target, opts) {
  if (opts.nodePath) {
    // check if the nodePath exists
    if (!(await exists(opts.nodePath))) {
      throw new Error(`Priovided node executable path "${opts.nodePath}" does not exist`);
    }
    return opts.nodePath;
  }
  if (opts.useLocalNode) {
    return process.execPath;
  }
  const os = getNodeOs(target.platform);
  const arch = getNodeArch(target.arch);
  const nodeVersion = await getNodeVersion(os, arch, target.nodeRange.replace('node', ''));
  const fileName = `node-${nodeVersion}-${os}-${arch}.${os === 'win' ? 'zip' : 'tar.gz'}`;
  let url;
  let checksumUrl;
  switch (arch) {
    case 'riscv64':
    case 'loong64':
      url = `https://unofficial-builds.nodejs.org/download/release/${nodeVersion}/${fileName}`;
      checksumUrl = `https://unofficial-builds.nodejs.org/download/release/${nodeVersion}/SHASUMS256.txt`;
      break;
    default:
      url = `https://nodejs.org/dist/${nodeVersion}/${fileName}`;
      checksumUrl = `https://nodejs.org/dist/${nodeVersion}/SHASUMS256.txt`;
      break;
  }
  const downloadDir = (0, path_1.join)((0, os_1.homedir)(), '.pkg-cache', 'sea');
  // Ensure the download directory exists
  if (!(await exists(downloadDir))) {
    await (0, promises_1.mkdir)(downloadDir, { recursive: true });
  }
  const filePath = (0, path_1.join)(downloadDir, fileName);
  // skip download if file exists
  if (!(await exists(filePath))) {
    log_1.log.info(`Downloading nodejs executable from ${url}...`);
    await downloadFile(url, filePath);
  }
  log_1.log.info(`Verifying checksum of ${fileName}`);
  await verifyChecksum(filePath, checksumUrl, fileName);
  log_1.log.info(`Extracting node binary from ${fileName}`);
  const nodePath = await extract(os, filePath);
  return nodePath;
}
/** Bake the blob into the executable */
async function bake(nodePath, target, blobPath) {
  const outPath = (0, path_1.resolve)(process.cwd(), target.output);
  log_1.log.info(`Creating executable for ${target.nodeRange}-${target.platform}-${target.arch}....`);
  if (!(await exists((0, path_1.dirname)(outPath)))) {
    log_1.log.error(`Output directory "${(0, path_1.dirname)(outPath)}" does not exist`);
    return;
  }
  // check if executable_path exists
  if (await exists(outPath)) {
    log_1.log.warn(`Executable ${outPath} already exists, will be overwritten`);
  }
  // copy the executable as the output executable
  await (0, promises_1.copyFile)(nodePath, outPath);
  log_1.log.info(`Injecting the blob into ${outPath}...`);
  if (target.platform === 'macos') {
    (0, mach_o_1.removeMachOExecutableSignature)(outPath);
    await exec(
      `npx postject "${outPath}" NODE_SEA_BLOB "${blobPath}" --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA`,
    );
  } else {
    await exec(
      `npx postject "${outPath}" NODE_SEA_BLOB "${blobPath}" --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2`,
    );
  }
}
/** Create NodeJS executable using sea */
async function sea(entryPoint, opts) {
  entryPoint = (0, path_1.resolve)(process.cwd(), entryPoint);
  if (!(await exists(entryPoint))) {
    throw new Error(`Entrypoint path "${entryPoint}" does not exist`);
  }
  const nodeMajor = parseInt(process.version.slice(1).split('.')[0], 10);
  // check node version, needs to be at least 20.0.0
  if (nodeMajor < 20) {
    throw new Error(`SEA support requires as least node v20.0.0, actual node version is ${process.version}`);
  }
  const nodePaths = await Promise.all(opts.targets.map((target) => getNodejsExecutable(target, opts)));
  // create a temporary directory for the processing work
  const tmpDir = (0, path_1.join)((0, os_1.tmpdir)(), 'pkg-sea', `${Date.now()}`);
  await (0, promises_1.mkdir)(tmpDir, { recursive: true });
  const previousDirectory = process.cwd();
  try {
    // change working directory to the temp directory
    process.chdir(tmpDir);
    // docs: https://nodejs.org/api/single-executable-applications.html
    const blobPath = (0, path_1.join)(tmpDir, 'sea-prep.blob');
    const seaConfigFilePath = (0, path_1.join)(tmpDir, 'sea-config.json');
    const seaConfig = Object.assign(
      { main: entryPoint, output: blobPath },
      Object.assign(Object.assign({}, defaultSeaConfig), opts.seaConfig || {}),
    );
    log_1.log.info('Creating sea-config.json file...');
    await (0, promises_1.writeFile)(seaConfigFilePath, JSON.stringify(seaConfig));
    log_1.log.info('Generating the blob...');
    await exec(`node --experimental-sea-config "${seaConfigFilePath}"`);
    await Promise.allSettled(
      nodePaths.map(async (nodePath, i) => {
        const target = opts.targets[i];
        await bake(nodePath, target, blobPath);
        const output = target.output;
        if (opts.signature && target.platform === 'macos') {
          const buf = (0, mach_o_1.patchMachOExecutable)(await (0, promises_1.readFile)(output));
          await (0, promises_1.writeFile)(output, buf);
          try {
            // sign executable ad-hoc to workaround the new mandatory signing requirement
            // users can always replace the signature if necessary
            (0, mach_o_1.signMachOExecutable)(output);
          } catch (_a) {
            if (target.arch === 'arm64') {
              log_1.log.warn('Unable to sign the macOS executable', [
                'Due to the mandatory code signing requirement, before the',
                'executable is distributed to end users, it must be signed.',
                'Otherwise, it will be immediately killed by kernel on launch.',
                'An ad-hoc signature is sufficient.',
                'To do that, run pkg on a Mac, or transfer the executable to a Mac',
                'and run "codesign --sign - <executable>", or (if you use Linux)',
                'install "ldid" utility to PATH and then run pkg again',
              ]);
            }
          }
        }
      }),
    );
  } catch (error) {
    throw new Error(`Error while creating the executable: ${error}`);
  } finally {
    // cleanup the temp directory
    await (0, promises_1.rm)(tmpDir, { recursive: true }).catch(() => {
      log_1.log.warn(`Failed to cleanup the temp directory ${tmpDir}`);
    });
    process.chdir(previousDirectory);
  }
}
exports.default = sea;
//# sourceMappingURL=sea.js.map
