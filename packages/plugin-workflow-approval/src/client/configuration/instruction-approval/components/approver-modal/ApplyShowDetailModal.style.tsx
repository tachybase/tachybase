import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      .ant-drawer-body {
        background: var(--tb-box-bg);
      }
    `,
  };
});
