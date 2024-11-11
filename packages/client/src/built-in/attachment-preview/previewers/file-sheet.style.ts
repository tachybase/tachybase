import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    excelPreview: css`
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      /* width: 100%;
      height: 90vh; */
    `,
    container: css`
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      height: 90vh;
      overflow-x: scroll;
      overflow-y: scroll;
    `,
    loading: css`
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      background-color: rgba(255, 255, 255, 0.75);
    `,
  };
});
