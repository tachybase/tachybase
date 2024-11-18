import { createStyles } from '@tachybase/client';

const useStyles = createStyles(({ css }) => {
  return {
    ApprovalsSummaryStyle: css`
      text-align: left;
      &-item {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        overflow: hidden;

        &-label {
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #aaa;
        }
        &-value {
          white-space: pre-wrap;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    `,
  };
});

export default useStyles;
