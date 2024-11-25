import { createStyles } from '@tachybase/client';

const useStyles = createStyles(({ css, token }) => {
  return {
    workflowPageClass: css`
      flex-grow: 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: calc(100vh - var(--tb-header-height));
      .workflow-toolbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
        padding: 0.5rem 1rem;
        background: ${token.colorBgContainer};
        border-bottom: 1px solid ${token.colorBorderSecondary};

        header {
          display: flex;
          align-items: center;
        }

        aside {
          display: flex;
          align-items: center;
          gap: 0.5em;
        }

        .workflow-versions {
          label {
            margin-right: 0.5em;
          }
        }
      }

      .workflow-content {
        display: flex;
        height: 100%;
      }

      .workflow-operator-area {
        overflow-y: scroll;
        padding: 24px 18px 48px 18px;
        background-color: white;
      }

      .workflow-canvas-wrapper {
        flex-grow: 1;
        overflow: hidden;
        position: relative;
        height: 100%;
      }

      .workflow-canvas-zoomer {
        display: flex;
        align-items: center;
        position: absolute;
        top: 2em;
        right: 2em;
        height: 10em;
        padding: 1em 0;
        border-radius: 0.5em;
        background: ${token.colorBgContainer};
      }

      .workflow-canvas {
        overflow: auto;
        height: 100%;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2em;
        padding-bottom: 200px;
        scrollbar-width: none;

        > .ant-alert {
          margin-bottom: 2em;
          font-size: 85%;
        }
      }

      .workflow-canvas::-webkit-scrollbar {
        display: none;
      }
    `,

    dropdownClass: css`
      .ant-dropdown-menu-item {
        justify-content: flex-end;
        .ant-dropdown-menu-title-content {
          display: flex;
          align-items: baseline;
          justify-content: flex-end;
          text-align: right;

          time {
            width: 14em;
            font-size: 80%;
          }
        }
      }
    `,

    workflowVersionDropdownClass: css`
      .ant-dropdown-menu-item {
        .ant-dropdown-menu-title-content {
          strong {
            font-weight: normal;
          }

          > .enabled {
            strong {
              font-weight: bold;
            }
          }

          > .unexecuted {
            strong {
              font-style: italic;
            }
          }
        }
      }
    `,

    executionsDropdownRowClass: css`
      .ant-dropdown-menu-item {
        .id {
          flex-grow: 1;
          text-align: right;
        }
      }
    `,

    branchBlockClass: css`
      display: flex;
      position: relative;
      margin: 2em auto auto auto;

      :before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(50% - 0.5px);
        width: 1px;
        background-color: ${token.colorBgLayout};
      }
    `,

    branchClass: css`
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      min-width: 20em;
      padding: 0 2em;

      .workflow-node-list {
        flex-grow: 1;
      }

      .workflow-branch-lines {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: ${token.colorBorder};
      }

      :before,
      :after {
        content: '';
        position: absolute;
        height: 1px;
        background-color: ${token.colorBorder};
      }

      :before {
        top: 0;
      }

      :after {
        bottom: 0;
      }

      :not(:first-child):not(:last-child) {
        :before,
        :after {
          left: 0;
          width: 100%;
        }
      }

      :last-child:not(:first-child) {
        :before,
        :after {
          right: 50%;
          width: 50%;
        }
      }

      :first-child:not(:last-child) {
        :before,
        :after {
          left: 50%;
          width: 50%;
        }
      }

      .end-sign {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 0;
        height: 6em;
        border-left: 1px dashed ${token.colorBgLayout};

        .anticon {
          font-size: 1.5em;
          line-height: 100%;
        }
      }
    `,

    nodeJobButtonClass: css`
      display: inline-flex;
      justify-content: center;
      align-items: center;
      color: ${token.colorTextLightSolid};
    `,

    nodeHeaderClass: css`
      position: relative;
    `,

    nodeMetaClass: css`
      margin-bottom: 0.5em;

      .workflow-node-id {
        color: ${token.colorTextDescription};

        &:before {
          content: '#';
        }
      }
    `,

    nodeTitleClass: css`
      display: flex;
      align-items: center;
      font-weight: normal;
      .workflow-node-id {
        color: ${token.colorTextDescription};
      }
    `,

    nodeSubtreeClass: css`
      display: flex;
      flex-direction: column-reverse;
      align-items: center;
      margin: auto;
    `,

    nodeJobResultClass: css`
      padding: 1em;
      background-color: ${token.colorBgContainer};
    `,

    addButtonClass: css`
      flex-shrink: 0;
      padding: 2em 0;

      > .ant-btn {
        &:disabled {
          visibility: hidden;
        }
      }
    `,

    conditionClass: css`
      position: relative;
      overflow: visible;

      > span {
        position: absolute;
        top: calc(1.5em - 1px);
        line-height: 1em;
        color: ${token.colorTextSecondary};
        background-color: ${token.colorBgLayout};
        padding: 1px;
      }
    `,

    loopLineClass: css`
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 2em;
      height: 6em;
    `,

    terminalClass: css`
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 4em;
      height: 4em;
      border-radius: 50%;
      background-color: ${token.colorText};
      color: ${token.colorBgContainer};

      .workflow-node-config-button {
        display: none;
      }
    `,
  };
});

export default useStyles;
