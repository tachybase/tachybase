import { createStyles } from '@tachybase/client';

export const useStyles = createStyles(({ css, token }) => {
  return {
    mobileNav: css`
      position: relative;
      width: 100%;
      .ant-btn {
        display: flex;
        align-items: center;
        height: 100%;
        position: absolute;
        right: 20px;
        bottom: 0;
        border: none;
      }
    `,
  };
});

export const useModalStyles = createStyles(({ css, token }) => {
  return {
    modal: css`
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      .tb-header-modal-list {
        width: 50%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        .anticon {
          width: 100%;
          display: flex;
          justify-content: center;
          svg {
            width: 40px;
            height: 40px;
          }
        }
        .tb-header-modal-list-text {
          text-align: center;
        }
      }
    `,
    imageModal: css`
      .ant-modal-content {
        width: 280px;
        height: 360px;
      }
    `,
  };
});
