import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 90vh;
      overflow-x: scroll;
      overflow-y: scroll;
    `,
    footer: css`
      text-align: center;
      border-bottom: 1px dashed;
    `,
    footerText: css`
      margin-bottom: 2px;
    `,
  };
});
