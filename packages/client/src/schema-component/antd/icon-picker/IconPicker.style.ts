import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    popoverStyles: css`
      .ant-popover-inner {
        border-radius: 8px;
        padding: 0 !important;
      }
    `,
  };
});
