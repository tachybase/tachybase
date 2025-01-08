import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    settingLayout: css`
      /* Depends on antd's ProLayout component structure */
      .ant-pro-global-header-logo {
        cursor: pointer;
      }
    `,
  };
});
