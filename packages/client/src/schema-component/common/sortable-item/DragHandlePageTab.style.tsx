import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    dragHandleMenu: css`
      position: relative;
      width: 100%;
      height: 100%;

      &.draggable {
        cursor: move;
        padding: 0 10px;
        border-radius: 5px;
        background: #f0f0f0;
      }

      .wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
    `,
  };
});
