import { createStyles } from 'antd-style';

const useStyles = createStyles(({ token, css }) => {
  return {
    infiniteScroll: css`
      color: ${token.colorTextDescription};
      padding: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: ${token.fontSize};

      &-failed-text {
        display: inline-block;
        margin-right: 8px;
      }
    `,
  };
});

export default useStyles;
