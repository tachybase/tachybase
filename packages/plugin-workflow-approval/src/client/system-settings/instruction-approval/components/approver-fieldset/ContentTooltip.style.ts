import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css }) => {
  return {
    span: css`
      & + .anticon {
        margin-left: 0.25em;
      }
    `,
  };
});
