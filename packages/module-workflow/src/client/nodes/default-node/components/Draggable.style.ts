import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    draggable: css`
      &.showBackground {
        background-color: rgba(229, 229, 229, 0.5);
        border: 1px dashed rgba(239, 239, 239, 0.5);
      }
    `,
  };
});
