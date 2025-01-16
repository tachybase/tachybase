import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  return {
    menuSearch: css`
      /* NOTE: 这里的样式是为了让搜索框的样式, 避免上层 antd 写死的 padding-left: 24px 的影响 */
      position: absolute;
      top: 0;
      left: 0;

      /* NOTE: 放这三个样式是为了提升选择器优先级, 覆盖掉 antd 的默认样式 */
      .ant-input-wrapper .ant-input-affix-wrapper.ant-input-outlined {
        background-color: #f9f9f9;
        border-radius: 5px;
        border: none;
        box-shadow: none;
      }

      /* 移除 antd 默认的后置搜索图标 */
      .ant-input-group-addon {
        display: none;
      }
    `,
  };
});
