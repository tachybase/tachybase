import { createStyles } from 'antd-style';

const useStyles = createStyles(({ css, token }) => {
  return css`
    .card {
      margin-bottom: ${token.marginLG}px;
    }
  `;
});

export default useStyles;
