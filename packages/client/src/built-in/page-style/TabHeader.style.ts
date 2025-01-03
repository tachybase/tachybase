import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    tabWrapper: css`
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      padding: 0 10px;
    `,
    tabHeader: css`
      flex: 0 1 auto;
      position: relative;

      display: inline-flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      min-width: 10px;
      height: 32px;
      margin: 6px 2px;
      padding: 4px 15px;
      border: 1px solid transparent;
      border-radius: 6px;
      overflow: hidden;

      background-image: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.88);

      font-size: 14px;
      font-weight: 400;
      line-height: 1.5714285714285714;
      outline: none;
      text-align: center;
      touch-action: manipulation;
      user-select: none;
      white-space: nowrap;
      cursor: pointer;

      transition: all 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);

      &.active {
        background-color: rgba(0, 0, 0, 0.07);
      }

      .tab-text {
        min-width: 5px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  };
});
