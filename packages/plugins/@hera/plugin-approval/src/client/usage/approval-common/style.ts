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
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    `,
  };
});

export default useStyles;
