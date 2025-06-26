import { TinyColor } from '@ctrl/tinycolor';
import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css, token }) => {
  const borderColor = new TinyColor(token.colorSettings).setAlpha(0.6).toHex8String();
  return {
    container: css`
      height: 100%;
      overflow: hidden;
      .ant-table-thead {
        .ant-table-cell {
          text-align: center;
        }
      }
      .ant-table-wrapper {
        height: 100%;
        .ant-spin-nested-loading {
          height: 100%;
          .ant-spin-container {
            height: 100%;
            display: flex;
            flex-direction: column;
          }
        }
      }
      .ant-table {
        overflow-x: auto;
        overflow-y: hidden;
      }
    `,
    toolbar: css`
      // 扩大 SchemaToolbar 的面积
      .tb-action-link {
        margin: -${token.paddingContentVerticalLG}px -${token.marginSM}px;
        padding: ${token.paddingContentVerticalLG}px ${token.marginSM}px;
      }
    `,

    topActive: css`
      & > td {
        border-top: 2px solid ${borderColor} !important;
      }
    `,
    bottomActive: css`
      & > td {
        border-bottom: 2px solid ${borderColor} !important;
      }
    `,
    highlightRow: css`
      & > td {
        background-color: ${token.controlItemBgActiveHover} !important;
      }
      &:hover > td {
        background-color: ${token.controlItemBgActiveHover} !important;
      }
    `,
    headerCellDesigner: css`
      max-width: 300px;
      white-space: nowrap;
      &:hover .general-schema-designer {
        display: block;
      }
    `,
    bodyCell: css`
      max-width: 300px;
      white-space: nowrap;
      .tb-read-pretty-input-number {
        text-align: right;
      }
      .ant-color-picker-trigger {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    `,
    rowSelect: css`
      position: relative;
      display: flex;
      float: left;
      align-items: center;
      justify-content: space-evenly;
      padding-right: 8px;
      .tb-table-index {
        opacity: 0;
      }
      &:not(.checked) {
        .tb-table-index {
          opacity: 1;
        }
      }
    `,
    rowSelectHover: css`
      &:hover {
        .tb-table-index {
          opacity: 0;
        }
        .tb-origin-node {
          display: block;
        }
      }
    `,
    cellChecked: css`
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    `,
    cellCheckedNode: css`
      position: absolute;
      right: 50%;
      transform: translateX(50%);
      &:not(.checked) {
        display: none;
      }
    `,
    // TASK 3 表单标题居中对齐
    shareTableCenter: css`
      text-align: center !important;
    `,
  };
});
