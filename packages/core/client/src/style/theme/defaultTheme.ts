import { ThemeConfig } from './type';

const defaultTheme: ThemeConfig = {
  name: '',
  token: {
    // 顶部导航栏
    colorPrimaryHeader: '#3791e7',
    colorBgHeader: '#3791e7',
    colorBgHeaderMenuHover: '#ffffff1a',
    colorBgHeaderMenuActive: '#ffffff1a',
    colorTextHeaderMenu: '#ffffffa6',
    colorTextHeaderMenuHover: '#ffffff',
    colorTextHeaderMenuActive: '#ffffff',

    // UI 配置组件
    colorSettings: '#2196f3',
    colorBgSettingsHover: 'rgba(33,150,243, 0.06)',
    colorBorderSettingsHover: 'rgba(33,150,243, 0.3)',
    motionUnit: 0.03,
    motion: !process.env.__E2E__,
  },
};

export default defaultTheme;
