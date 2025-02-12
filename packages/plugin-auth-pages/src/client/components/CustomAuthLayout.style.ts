import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    customAuthLayout: css`
      width: 100%;
      height: 100vh;
      background-color: #fff;

      .account-logo {
        position: absolute;
        left: 60px;
        top: 40px;
        height: 48px;
        cursor: pointer;
      }

      .logo-img {
        height: 48px;
      }

      .account-bg {
        width: 100%;
        height: 100%;
        background-position: 50%;
        background-size: cover;
        background-repeat: no-repeat;
        background-image: url('https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/7b4b4565b3b11041505edfbc0c770646.webp');
      }

      .account-wrapper {
        position: relative;
        display: grid;
        place-items: center;
      }

      .account-container {
        position: relative;
        margin: 0 auto;
        width: 400px;
        max-width: 480px;
        transform: translateY(-50%);
      }

      .account-poweredby {
        position: absolute;
        bottom: 24px;
        width: 100%;
        left: 0;
        text-align: center;
      }
    `,
  };
});
