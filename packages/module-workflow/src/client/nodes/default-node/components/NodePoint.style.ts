import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    nodePoint: css`
      border-radius: 15px;
      transform: translateX(25%);

      .workflow-node-prefix {
        display: inline-flex;

        box-sizing: border-box;
        height: 100%;
        padding-right: 12px;
        padding-left: 12px;
        border-right: solid 1px;
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;

        background-color: #5a84ff;
        color: white;
      }

      .workflow-node-edit {
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
        background-color: #fff;
        font-weight: 400;
        font-size: 14px;
        color: #1d2129;
      }

      .workflow-node-suffix {
        display: inline-flex;
        gap: 10px;
        box-sizing: border-box;
        margin-left: 12px;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;

        background-color: transparent;
        color: #fff;

        .icon-button {
          display: inline-flex;
          align-items: center;
          color: inherit;
          font-style: normal;
          line-height: 0;
          text-align: center;
          text-transform: none;
          vertical-align: -0.125em;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;

          .workflow-node-remove-button {
            background-color: #fff;
            color: #ff7c87;
          }
          .workflow-node-drag-button {
            background-color: #fff;
            cursor: grab;
          }
        }
      }
    `,
  };
});

export default useStyles;
