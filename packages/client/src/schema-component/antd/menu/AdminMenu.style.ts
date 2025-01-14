import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    adminMenuStyle: css`
      border: none;
      max-width: 21rem;
    `,

    adminMenuCardStyle: css`
      display: block;
      color: 'inherit';
      padding: ${token.marginSM};
      box-shadow: none;
      width: 7rem;
      height: 5rem;

      &:hover {
        border-radius: ${token.borderRadius}px;
        background: rgba(0, 0, 0, 0.045);
        overflow: hidden;
      }
      .ant-btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: none;
        box-shadow: none;
        padding-left: 0;
        padding-right: 0;
        width: 100%;
        span {
          display: block;
          text-align: center;
          font-size: ${token.fontSizeSM}px;
        }
        .anticon {
          font-size: 1.2rem;
          margin-bottom: 0.3rem;
          text-align: center;
        }
      }
      .ant-btn-default {
        box-shadow: none;
      }
      .general-schema-designer {
        background: none;
      }

      .field-link {
        display: block;
        color: inherit;
        &:hover {
          color: inherit;
        }
      }

      .icon-wrapper {
        font-size: 1.2rem;
        text-align: center;
        margin-bottom: 0.3rem;
      }

      .field-title {
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: ${token.fontSizeSM};
      }
    `,
  };
});
