import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    tabComponentClass: css`
      .ant-tabs-nav-wrap.ant-tabs-nav-wrap {
        flex: none;
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

    tabWrapper: css`
      flex: 1;
      display: flex;
      flex-direction: row;
      justify-content: flex-end;
    `,
  };
});
