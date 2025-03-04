import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  iconPickerContent: css`
    &.ant-tabs .ant-tabs-nav {
      gap: 50px;
    }
  `,
}));
