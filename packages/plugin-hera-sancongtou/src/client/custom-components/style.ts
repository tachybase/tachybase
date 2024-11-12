import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css }) => ({
  ['m-detail']: css`
    /* background-color: red; */
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  `,
  ['m-share']: css`
    align-self: 'center';
    font-size: 16;
  `,
}));
