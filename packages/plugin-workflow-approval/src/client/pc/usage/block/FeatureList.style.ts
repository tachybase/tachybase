import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    featureList: css`
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      justify-items: center;
      gap: 10px;
    `,
  };
});
