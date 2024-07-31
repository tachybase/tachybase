require('@nomicfoundation/hardhat-toolbox');
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'gethlocal',
  networks: {
    gethlocal: {
      url: 'http://127.0.0.1:8888/',
      chainId: 1337,
    },
  },
};

//控制台运行 pnpm i @nomicfoundation/hardhat-toolbox
