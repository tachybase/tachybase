import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ css }) => {
  return {
    toolbar: {
      position: 'absolute',
      zIndex: 999,
      display: 'none',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      border: '2px solid var(--colorBorderSettingsHover)',
      background: 'var(--colorBgSettingsHover)',
      pointerEvents: 'none',

      '.ant-space-item .anticon': {
        margin: 0,
      },
    },
    toolbarTitle: {
      pointerEvents: 'none',
      position: 'absolute',
      fontSize: 12,
      padding: 0,
      lineHeight: '16px',
      height: '16px',
      borderBottomRightRadius: 2,
      borderRadius: 2,
      top: 2,
      left: 2,
    },
    toolbarTitleTag: {
      padding: '0 3px',
      borderRadius: 2,
      background: 'var(--colorSettings)',
      color: '#fff',
      display: 'block',
    },
    toolbarIcons: {
      position: 'absolute',
      right: '2px',
      top: '2px',
      lineHeight: '16px',
      pointerEvents: 'all',
      '.ant-space-item': {
        backgroundColor: 'var(--colorSettings)',
        color: '#fff',
        lineHeight: '16px',
        width: '16px',
        paddingLeft: '1px',
        alignSelf: 'stretch',
      },
    },
    titleCss: css`
      pointer-events: none;
      position: absolute;
      font-size: 12px;
      /* background: var(--colorSettings);
  color: #fff; */
      padding: 0;
      line-height: 16px;
      height: 16px;
      border-bottom-right-radius: 2px;
      border-radius: 2px;
      top: 2px;
      left: 2px;
      .title-tag {
        padding: 0 3px;
        border-radius: 2px;
        background: var(--colorSettings);
        color: #fff;
        display: block;
      }
    `,
    overrideAntdCSS: css`
      & .ant-space-item .anticon {
        margin: 0;
      }

      &:hover {
        display: block !important;
      }
    `,
  };
});
