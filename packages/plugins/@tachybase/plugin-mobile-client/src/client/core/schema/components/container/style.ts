import { createStyles } from '@tachybase/client';

const useStyles = createStyles(({ token, css }) => {
  return {
    mobileContainer: css`
      --adm-color-primary: ${token.colorPrimary};

      & > .general-schema-designer > .general-schema-designer-icons {
        right: unset;
        left: 2px;
      }
      background: var(--tb-box-bg);
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      position: initial !important;
    `,

    tabBar: css`
      & > .general-schema-designer {
        --tb-designer-top: ${token.marginMD}px;
      }
      position: fixed;
      background: ${token.colorBgContainer};
      width: 100%;
      bottom: 0;
      left: 0;
      z-index: 1000;
    `,
  };
});

export default useStyles;
