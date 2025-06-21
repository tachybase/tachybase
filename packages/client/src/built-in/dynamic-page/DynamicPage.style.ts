import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  'dynamic-page': css`
    display: flex;
    flex-direction: column;
    height: 100vh;
    .page-content {
      height: 90%;
      margin: ${token.paddingContentHorizontal}px;
      overflow: hidden;
    }
  `,
}));
