import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => ({
  nodeIdClass: css`
    color: ${token.colorTextDescription};

    &:before {
      content: '#';
    }
  `,
}));
