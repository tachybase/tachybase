import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    nodePoint: css`
      position: relative;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      box-sizing: border-box;
      height: 100%;
      border-radius: 50px;
      background-color: #fff;

      /* 控制节点选中态的背景样式 */
      &.configuring {
        background-color: var(--colorPrimaryText);
        .workflow-node-edit {
          background-color: transparent;
        }
      }

      .workflow-node-prefix {
        display: inline-flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;

        box-sizing: border-box;
        height: 100%;
        padding: 17px 0;
        padding-left: 12px;
        padding-right: 12px;
        border-right: solid 1px;
        border-top-left-radius: 50px;
        border-bottom-left-radius: 50px;

        background-color: #5a84ff;
        color: white;

        /* 微调节点的 icon 样式 */
        span {
          display: inline-block;
          padding-left: 12px;
          svg {
            width: 20px;
            height: 20px;
          }
        }
      }

      .workflow-node-edit {
        box-sizing: border-box;
        height: 100%;
        padding: 17px 20px;
        border-top-right-radius: 50px;
        border-bottom-right-radius: 50px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: #fff;
        font-weight: 400;
        font-size: 14px;
        color: #1d2129;
        cursor: pointer;

        :focus {
          cursor: text;
        }

        &.node-executed {
          :focus {
            cursor: pointer;
          }
        }
      }

      .workflow-node-suffix {
        position: absolute;
        top: 25%;
        right: -120px;
        display: inline-flex;
        gap: 10px;
        box-sizing: border-box;
        margin-left: 12px;
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        transform: translateX(-50%);

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
