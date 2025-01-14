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
      &.leftBorder {
        ::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 50%;
          background-color: var(--colorPrimaryText);

          /* 使用 clip-path 裁剪为梯形 */
          clip-path: polygon(0 0, 100% 15%, 100% 85%, 0 100%);
        }
      }

      &.adminMenu {
        .general-schema-designer {
          display: none;
        }
      }

      .wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
      }
    `,
  };
});
