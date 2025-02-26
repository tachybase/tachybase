import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    tabFooterClass: css`
      .ant-tabs-nav-list {
      }

      .ant-tabs-tab.ant-tabs-tab {
        border: none;
        background-color: #ffffff;
      }

      .ant-tabs-tab-active.ant-tabs-tab-active.ant-tabs-tab-active.ant-tabs-tab-active {
        border-radius: 8px 8px 0 0;
        box-shadow: none;
        text-shadow: none;
        background-color: var(--tb-box-bg);
      }
    `,
  };
});
