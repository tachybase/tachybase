import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    featureList: css`
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      justify-items: start;
      gap: 10px;
      grid-row-gap: 30px;
    `,
  };
});
