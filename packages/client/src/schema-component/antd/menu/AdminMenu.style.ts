import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    adminMenuStyle: css`
      border: none;
      border-radius: 8px 8px 8px 8px;
      background: #ffffff;
      box-shadow:
        0px 4px 8px 0px rgba(0, 5, 26, 0.15),
        0px 0px 8px 0px rgba(0, 5, 26, 0.05);

      .ant-card-body {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        justify-items: center;
        gap: 10px;
        grid-row-gap: 10px;
      }

      .ant-card-body::before {
        display: none;
      }
    `,

    adminMenuCardStyle: css`
      &.ant-card-grid {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 5rem;
        color: inherit;
        border: 0;
        border-radius: 8px;
        box-shadow: none;

        &:hover {
          background-color: #f4f4f4;
          box-shadow: none;
        }
      }

      &.ant-card-grid .ant-btn {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 100%;
        padding: 0;
        border: none;
        box-shadow: none;
        background-color: red;
      }

      .field-link {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
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
        vertical-align: middle;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: ${token.fontSizeSM};
      }

      .designer-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;

        display: flex;
        justify-content: center;
        align-items: center;

        width: 100%;
        height: 45%;
        border-radius: 1px 1px 8px 8px;
        background: rgba(0, 0, 0, 0.5);
        visibility: hidden;
      }

      &.ant-card-grid:hover .designer-wrapper {
        visibility: visible;
      }

      .designer-wrapper .anticon-menu {
        padding: 1px;
        border-radius: 2px;
        background-color: #ffffff;
        color: #2f2f2f;
      }
    `,
  };
});
