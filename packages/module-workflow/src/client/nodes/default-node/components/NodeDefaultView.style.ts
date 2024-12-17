import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    nodeClass: css`
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    `,

    nodeCardClass: css`
      position: relative;
      display: flex;

      margin: 0 50px;
      padding: 0;
      border-radius: 12px;
      cursor: pointer;

      .workflow-node-remove-button {
        color: ${token.colorText};

        &:hover {
          color: ${token.colorErrorHover};
        }
      }

      .ant-input {
        font-weight: bold;
        background-color: transparent;
        border: none;
        box-shadow: none;
      }

      .workflow-node-config-button {
        padding: 0;
        display: none;
      }
    `,
  };
});

export default useStyles;
