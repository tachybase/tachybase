import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    addButtonClass: css`
      flex-shrink: 0;
      padding: 2em 0;

      > .ant-btn {
        border-radius: 8px;
        background-color: #fff;
        color: #000;

        &:disabled {
          visibility: hidden;
        }
      }
    `,

    dropDownClass: css`
      .ant-dropdown-menu-root {
        max-height: 30em;
        border-radius: 8px;
        overflow-y: auto;
      }
    `,

    iconContainerClass: css``,
  };
});

export default useStyles;
