import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    excelPreview: css`
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 90vh;
      width: 100vw;
    `,
    container: css`
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 90vh;
      overflow-x: scroll;
      overflow-y: scroll;
    `,
  };
});
