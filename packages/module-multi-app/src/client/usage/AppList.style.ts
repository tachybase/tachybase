import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    appListStyle: css`
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    `,
  };
});
