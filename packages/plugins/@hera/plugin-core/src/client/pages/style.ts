import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => ({
  home: css`
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    header {
      .headerStyle {
        width: 100%;
        height: 60px;
        background-color: #f7f7f7;
        display: flex;
        align-items: center;
        border-radius: 8px;
        box-shadow: 0 0 1px 1px #e3e3e3;
        padding: 0px 10px 0px 15px;
        .headerTitle {
          height: 60px;
          color: #6c6c6c;
          font-size: 20px;
          font-weight: 400;
          line-height: 60px;
        }
        ul {
          color: #6c6c6c;
          display: flex;
          align-items: center;
          height: 100%;
          margin-top: 0;
          margin-bottom: 0;
          padding: 0 0 0 25px;
          li {
            list-style: none;
            padding-left: 5px;
            padding-right: 5px;
            text-align: center;
            height: 100%;
            line-height: 60px;
            &:hover {
              background-color: #e3e3e3;
            }
          }
          .active {
            background-color: #e3e3e3;
          }
        }
      }
    }
    main {
      padding: 20px 10px;
      height: 500px;
      div {
        height: 500px;
        img {
          width: 100%;
          height: auto;
        }
      }
      .ant-carousel .slick-dots-bottom {
        bottom: 50px;
      }
      .ant-carousel .slick-dots li {
        width: 10px;
        height: 10px;
        border-radius: 50px;
        border: 1px solid #ffffff;
      }

      .ant-carousel .slick-dots li button {
        width: 10px;
        height: 10px;
        border-radius: 50px;
        opacity: 0;
      }
      .ant-carousel .slick-dots li.slick-active button {
        opacity: 1;
      }
    }
    footer {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 22px;
      a {
        color: #3372af;
      }
      ul {
        display: flex;
        margin: 0;
        bottom: 0;
        li {
          list-style: none;
          a {
            border-right: 1.5px solid black;
            padding: 0 5px;
          }
          &:nth-last-child(1) a {
            border-right: 0;
          }
        }
      }
      div {
        a {
          margin-left: 5px;
        }
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
