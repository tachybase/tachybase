import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    dragHandleMenu: css`
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      &.draggable {
        cursor: move;
        z-index: 9999;
        background-color: red;
      }
    `,
  };
});
