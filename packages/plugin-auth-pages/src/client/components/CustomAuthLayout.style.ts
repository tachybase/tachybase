import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    customAuthLayout: css`
      width: 100%;
      height: 100vh;
      background-color: #fff;

      .account-bg {
        width: 100%;
        height: 100%;
        background-position: 50%;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url('https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/7b4b4565b3b11041505edfbc0c770646.webp');
      }
    `,
  };
});
