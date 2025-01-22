import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    uploadConfigIcon: css`
      display: grid;
      place-items: center;
      border: none;
      .dyc-upload {
        width: 100%;
        background-color: blue;
        .dyc-upload-area {
          border: none;
          background: none;
          background-color: red;

          cursor: pointer;
        }
      }
    `,
  };
});
