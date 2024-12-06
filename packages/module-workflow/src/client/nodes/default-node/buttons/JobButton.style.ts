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
      // 向左平移 3 个身位, 因为执行态不会出现删除和拖动按钮, 因此是没有问题.可以保持美观
      transform: translateX(-300%);
    `,
  };
});

export default useStyles;
