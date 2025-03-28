import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  iconPickerContent: css`
    width: 20dvw;
    height: 25dvw;
    position: relative;
    overflow: hidden;
    .ant-tabs {
      width: 20dvw;
      height: 25dvw;
      margin: 0;
      .ant-tabs-nav {
        padding: 15px 15px 0 15px;
      }
    }
    .ant-tabs-extra-content {
      width: 30%;
    }
  `,
}));
