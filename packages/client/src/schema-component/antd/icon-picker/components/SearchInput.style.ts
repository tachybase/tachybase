import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => ({
  searchInput: css`
    .ant-tabs-extra-content,
    .ant-input-affix-wrapper,
    .ant-input-affix-wrapper-focused,
    .ant-input-outlined:focus-within {
      border: none;
      box-shadow: none;
    }
  `,
}));
