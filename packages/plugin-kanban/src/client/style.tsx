import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ token, css }) => {
  return {
    nbKanban: css`
      overflow: hidden;
      height: 100%;
      overflow-y: auto;
      .ant-spin-container {
        height: 100%;
        .ant-formily-item-label: {
          color: #8c8c8c;
          fontweight: normal;
        }
        // 为了撑满固定卡片时的高度
        & > * {
          height: 100%;
        }
      }
    `,
  };
});
