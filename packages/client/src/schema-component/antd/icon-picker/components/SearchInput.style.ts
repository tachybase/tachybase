import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  searchInput: css`
    .ant-input-outlined.ant-input-outlined.ant-input-outlined {
      background-color: #f5f8fe;
      border-radius: 20px;
      border: none;
      box-shadow: none;
    }

    .ant-input-group-addon {
      display: none;
    }
  `,
}));
