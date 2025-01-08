import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    settingLayout: css`
      .ant-pro-global-header-logo {
        cursor: pointer;
      }
    `,
  };
});
