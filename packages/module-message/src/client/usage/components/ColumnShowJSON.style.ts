import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css }) => {
  return {
    columnShowJSON: css`
      text-align: left;
      .json-item {
        display: flex;
        flex-direction: row;
        align-items: baseline;
        overflow: hidden;

        .item-label {
          text-overflow: ellipsis;
          white-space: nowrap;
          color: #aaa;
        }
        .item-value {
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
