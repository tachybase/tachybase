import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return css`
    padding-top: ${token.paddingContentVerticalLG}px;
    background-color: var(--colorBgDrawer);
  `;
});
