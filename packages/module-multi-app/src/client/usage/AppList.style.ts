import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    appListStyle: css`
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      .media-card {
        position: relative;
        transition: background-color 0.3s ease;
        .media-actions {
          width: 100%;
          display: flex;
          flex-direction: row;
          justify-content: space-evenly;
          position: absolute;
          bottom: 8px;
          height: 22px;
          z-index: 10;
          background-color: #fafafa;
          visibility: hidden;
          .ant-btn {
            border: none;
            box-shadow: none;
            background-color: #fafafa;
            padding: 0;
            height: 20px;
          }
        }
      }
      .media-card:hover {
        background-color: #fafafa;
        transition: background-color 0.3s ease;
        border-radius: ${`${token.borderRadius}px`};
        .media-actions {
          visibility: visible;
        }
      }
    `,
  };
});
