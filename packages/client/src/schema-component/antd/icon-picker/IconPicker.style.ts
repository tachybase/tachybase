import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    popoverStyles: css`
      .ant-popover-inner {
        overflow: hidden;
        padding: 0 !important;
      }
    `,
  };
});
