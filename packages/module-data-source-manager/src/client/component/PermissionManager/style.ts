import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css }) => {
  return css`
    .ant-table-cell {
      > .ant-space-horizontal {
        .ant-space-item-split:has(+ .ant-space-item:empty) {
          display: none;
        }
      }
    }
  `;
});
