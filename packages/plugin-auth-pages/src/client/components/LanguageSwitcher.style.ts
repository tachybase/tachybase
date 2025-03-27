import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    languageText: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 15px;
      cursor: pointer;
    `,
  };
});
