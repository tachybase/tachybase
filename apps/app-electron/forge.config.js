const { resolve } = require('path');

module.exports = {
  packagerConfig: {
    // 处理静态资源路径（如图标、预加载脚本）
    icon: resolve(__dirname, 'icons/app.ico'),
    extraResource: [
      resolve(__dirname, 'src/preload.js'),
      resolve(__dirname, 'public/index.html'),
      resolve(__dirname, 'public/styles.css'),
    ],
    // 确保 Monorepo 依赖被正确解析
    ignore: [
      /^\/packages\//, // 忽略其他子包
      /^\/node_modules\/(?!shared-utils)/, // 只保留必要的依赖
      /^\/node_modules\/(?!electron|shared-utils)/,
    ],
    asar: true,
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'electron-app',
        setupIcon: resolve(__dirname, 'icons/installer.ico'),
        platform: 'win32',
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['linux'],
    },
    {
      name: '@electron-forge/maker-dmg',
      config: { platform: 'darwin' },
    },
  ],
};
