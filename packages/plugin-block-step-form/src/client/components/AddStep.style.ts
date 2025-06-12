import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css }) => {
  return {
    addStep: css`
      border-color: var(--colorSettings);
      color: var(--colorSettings);
    `,
  };
});
