import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      .ant-radio-group {
        .anticon {
          margin-left: 0.5em;
        }
      }
    `,
  };
});
