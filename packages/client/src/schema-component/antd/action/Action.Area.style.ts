import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    container: css`
      padding-top: ${token.padding}px;
    `,
    footer: css`
      display: flex;
      justify-content: flex-end;
      width: 100%;
      flex-shrink: 0;
      padding-bottom: ${token.padding}px;
      border-bottom: 1px solid rgba(5, 5, 5, 0.06);
      .ant-btn {
        margin-right: ${token.margin}px;
      }

      .title {
        flex: 1;
        margin: 0;
        color: rgba(0, 0, 0, 0.88);
        font-weight: 600;
        font-size: ${token.fontSizeHeading3}px;
        line-height: ${token.lineHeightHeading3};
        padding-right: 24px;
      }
    `,
  };
});
