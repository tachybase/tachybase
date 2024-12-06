import { createStyles } from '@tachybase/client';

const useStyles = createStyles(({ css, token }) => {
  return {
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

    nodeJobButtonClass: css`
      display: inline-flex;
      justify-content: center;
      align-items: center;
    `,
  };
});

export default useStyles;
