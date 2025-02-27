import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      &.tb-action-popup {
        .ant-modal-header {
          // TODO: theme variables
          margin-top: -20px;
          margin-left: -24px;
          margin-right: -24px;
          padding-top: 20px;
          padding-left: 24px;
          padding-right: 24px;
          padding-bottom: 20px;
        }
        .ant-modal-content {
          background: var(--tb-box-bg);
        }
      }
    `,

    modalClassName: css`
      max-height: 80vh;
      overflow: hidden;
      .ant-tabs-content-holder {
        height: 70vh;
        overflow-y: scroll;
        overflow-x: hidden;
      }
    `,
  };
});
