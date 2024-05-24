import { createStyles } from '@tachybase/client';

const useStyles = createStyles(({ token, css }) => {
  return {
    globalActionCSS: css`
      #nb-position-container > & {
        height: ${token.sizeXXL}px;
        border-top: 1px solid var(--tb-box-bg);
        margin-bottom: 0px !important;
        padding: 0 var(--tb-spacing);
        align-items: center;
        overflow-x: auto;
        background: ${token.colorBgContainer};
        z-index: 100;
      }
    `,

    mobilePage: css`
      background: var(--tb-box-bg);
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      padding-bottom: var(--tb-spacing);
    `,

    mobilePageHeader: css`
      & > .ant-tabs > .ant-tabs-nav {
        .ant-tabs-tab {
          margin: 0 !important;
          padding: 0 ${token.paddingContentHorizontal}px !important;
        }
        background: ${token.colorBgContainer};
      }
      display: flex;
      flex-direction: column;
    `,
  };
});

export default useStyles;
