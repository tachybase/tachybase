import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    languageText: css`
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 15px;
      cursor: pointer;

      .icon-globe {
        display: inline-block;
        width: 36px;
        height: 36px;
        background: url('https://tachybase-1321007335.cos.ap-shanghai.myqcloud.com/f5ea633d256287349ef1355840f988c1.svg')
          no-repeat center center;
        background-size: contain;
        vertical-align: middle;
      }
    `,
  };
});
