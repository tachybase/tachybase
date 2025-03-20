import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    mediaCardStyle: css`
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 10px;
      cursor: pointer;

      :hover {
        background-color: var(--colorPrimaryText);
        border-radius: 10px;
        transform: scale(1.05);
        transition: all 0.3s;
      }

      .icon-wrapper {
        padding: 20px;
        border-radius: 40%;
        .icon {
          padding: 10px;
          border-radius: 50%;
          background-color: #ffffff;
          font-size: 20px;
        }
      }

      .title {
        flex: 1;
        display: inline-block;
        font-size: 16px;
        color: #2f2f2f;
        overflow: hidden;
      }
    `,
  };
});
