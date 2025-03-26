import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  iconPickerContent: css`
    width: 20dvw;
    height: 20dvw;
    overflow: hidden;
    &.ant-tabs .ant-tabs-nav {
      gap: 50px;
      padding: 15px 15px 0 15px;
      margin: 0;
    }
    .ant-tabs-extra-content {
      width: 30%;
    }
  `,
}));
