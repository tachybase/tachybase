import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    appAction: css`
      width: 100%;
      display: flex;
      justify-content: flex-end;
    `,
    appListStyle: css`
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      .media-card {
        position: relative;
        transition: background-color 0.3s ease;
        border-radius: ${`${token.borderRadius}px`};
        overflow: hidden;
        .media-actions {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          position: absolute;
          bottom: 10px;
          height: 25px;
          z-index: 10;
          background-color: #fafafa;
          visibility: hidden;
          .ant-btn {
            width: 100%;
            border: none;
            box-shadow: none;
            background-color: #fafafa;
            padding: 0;
            height: 25px;
            border-radius: 0;
          }
        }
      }
      .media-card:hover {
        background-color: #fafafa;
        transition: background-color 0.3s ease;

        .media-actions {
          visibility: visible;
        }
      }
    `,
  };
});
