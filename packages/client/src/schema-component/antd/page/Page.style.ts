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
      .ant-tabs-extra-content {
        flex: 1;
      }
    `,

    tabWrapper: css`
      display: flex;
      flex-direction: row;
      justify-content: flex-end;

      &.designable {
        justify-content: space-between;
      }

      .scroll-area-extra-content {
        align-self: flex-end;
      }
    `,
  };
});
