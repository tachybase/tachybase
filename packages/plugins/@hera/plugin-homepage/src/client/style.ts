import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css }) => ({
  home: css`
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    header {
      .headerStyle {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: center;
        border-radius: 8px;
        padding: 0px 20px 0px 20px;
        .headerTitle {
          height: 60px;
          color: #6c6c6c;
          font-size: 20px;
          font-weight: 400;
          text-align: right;
        }
        ul {
          color: #6c6c6c;
          display: flex;
          justify-content: space-evenly;
          align-items: center;
          height: 100%;
          margin-top: 0;
          margin-bottom: 0;
          padding: 0 20px 0 20px;
          li {
            list-style: none;
            padding-left: 5px;
            padding-right: 5px;
            text-align: center;
            height: 100%;
            line-height: 60px;
            cursor: pointer;
            &:hover {
              color: #3578e2;
            }
          }
          .active {
            color: #3578e2;
          }
        }
        .ant-btn {
          width: 70%;
          height: 50px;
          &:hover {
            color: white;
          }
        }
      }
    }
    main {
      height: 500px;
      position: relative;
      img {
        width: 100%;
        height: auto;
      }
      .ant-btn {
        width: 10%;
        height: 50px;
        position: absolute;
        top: 48%;
        left: 56%;
        border-radius: 20px;
      }
    }
    footer {
      position: absolute;
      bottom: -30px;
      width: 100%;
      text-align: center;
      .beian {
        color: #000000;
      }
    }
  `,
}));

export const useHeadStyles = createStyles(({ token }) => {
  return {
    '.pageHeaderCss': {
      backgroundColor: token.colorBgContainer,
      paddingInline: token.paddingXS,
      '&.ant-page-header-has-footer': {
        paddingTop: token.paddingSM,
        paddingBottom: '0',
        '.ant-page-header-heading-left': {},
        '.ant-page-header-footer': { marginBlockStart: '0' },
      },
      '.ant-tabs-nav': { marginBottom: '0' },
      '.ant-page-header-heading-title': {
        color: token.colorText,
      },
    },

    '.height0': {
      fontSize: 0,
      height: 0,
    },
  };
});
