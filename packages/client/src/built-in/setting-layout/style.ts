import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    title: css`
      height: 32px;
      margin: 0;
      font-weight: 600;
      font-size: 18px;
      line-height: 32px;
      cursor: pointer;
    `,
  };
});
