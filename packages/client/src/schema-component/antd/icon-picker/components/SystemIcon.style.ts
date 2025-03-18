import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  systemIcon: css`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    height: 17dvw;
    justify-content: space-between;
    background-color: #f8f8f8;

    .system-icon-top {
      background-color: blue;
    }

    .system-icon-middle {
      flex: 1;
      background-color: green;
    }

    .system-icon-bottom {
      background-color: red;
    }
  `,
}));
