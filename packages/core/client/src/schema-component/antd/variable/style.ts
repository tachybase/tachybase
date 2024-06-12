import { createStyles } from 'antd-style';

export const useStyles = createStyles(({ token, css }, { multiline, disabled }) => {
  const { lineWidth, colorFillQuaternary } = token;
  const inputPaddingHorizontalBase = token.paddingSM - 1;
  const tagPaddingHorizontal = 8; // Fixed padding.
  const paddingInline = tagPaddingHorizontal - lineWidth;
  const tagFontSize = token.fontSizeSM;
  const tagLineHeight = `${token.lineHeightSM * tagFontSize}px`;
  const defaultBg = colorFillQuaternary;

  return {
    fixInput: css`
      .ant-input {
        box-sizing: border-box;
        margin: 0;
        padding: 3px 7px;
        color: rgba(0, 0, 0, 0.88);
        font-size: 12px;
        line-height: 1.6666666666666667;
        list-style: none;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans',
          sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';
        position: relative;
        display: inline-block;
        width: 100%;
        min-width: 0;
        border-radius: 0;
        transition: all 0.1s;
      }
    `,
    outerContainer: {
      width: 'auto',
      display: 'flex',
      '&.ant-input-group-compact': { display: 'flex' },
      '.ant-input-disabled': {
        '.ant-tag': { color: '#bfbfbf', borderColor: '#d9d9d9' },
      },
      '.ant-input.null-value': { width: '4em', minWidth: '4em' },

      '.ant-formily-item .ant-formily-item-control .ant-formily-item-control-content .ant-formily-item-control-content-component':
        {
          lineHeight: 'normal',
        },

      '.ant-formily-item': {
        marginBottom: 0,
      },

      '.ant-input': {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },

      '.ant-tag': {
        display: 'inline-block',
        height: 'auto',
        marginInlineEnd: token.marginXS,
        paddingInline,
        fontSize: tagFontSize,
        lineHeight: tagLineHeight,
        whiteSpace: 'nowrap',
        background: defaultBg,
        border: `${token.lineWidth}px ${token.lineType} ${token.colorBorder}`,
        borderRadius: token.borderRadiusSM,
        opacity: 1,
        transition: `all ${token.motionDurationMid}`,
        textAlign: 'start',
      },

      '.ant-tag-blue': {
        color: token.colorPrimaryText,
        background: token.colorPrimaryBg,
        borderColor: token.colorPrimaryBorder,
      },

      '.clear-button': {
        position: 'absolute',
        top: '50%',
        insetInlineStart: 'auto',
        insetInlineEnd: inputPaddingHorizontalBase,
        zIndex: 1,
        display: 'none',
        width: token.fontSizeIcon,
        height: token.fontSizeIcon,
        marginTop: -token.fontSizeIcon / 2,
        color: token.colorTextQuaternary,
        fontSize: token.fontSizeIcon,
        fontStyle: 'normal',
        lineHeight: 1,
        textAlign: 'center',
        textTransform: 'none',
        background: token.colorBgContainer,
        cursor: 'pointer',
        opacity: 0.8,
        transition: `color ${token.motionDurationMid} ease, opacity ${token.motionDurationSlow} ease`,
        textRendering: 'auto',
        userSelect: 'none',

        '&:before': {
          display: 'block',
        },

        '&:hover': {
          color: token.colorTextTertiary,
        },
      },

      '.ant-btn': {
        height: 'auto',
      },

      '.variable': {
        flex: 1,
      },
    },
    container: css`
      &.ant-input-group.ant-input-group-compact {
        display: flex;
        .ant-input {
          flex-grow: 1;
          min-width: 200px;
        }
        .ant-input-disabled {
          .ant-tag {
            color: #bfbfbf;
            border-color: #d9d9d9;
          }
        }
      }

      > .x-button {
        height: min-content;
      }
    `,
    button: css`
      overflow: auto;
      white-space: ${multiline ? 'normal' : 'nowrap'};

      .ant-tag {
        display: inline;
        line-height: 19px;
        margin: 0 0.5em;
        padding: 2px 7px;
        border-radius: 10px;
      }
    `,
    pretty: css`
      overflow: auto;

      .ant-tag {
        display: inline;
        line-height: 19px;
        margin: 0 0.25em;
        padding: 2px 7px;
        border-radius: 10px;
      }
    `,
    container2: css`
      position: relative;
      line-height: 0;

      &:hover {
        .clear-button {
          display: inline-block;
        }
      }

      .ant-input {
        overflow: auto;
        white-space: nowrap;
        ${disabled ? '' : 'padding-right: 28px;'}

        .ant-tag {
          display: inline;
          line-height: 19px;
          margin: 0;
          padding: 2px 7px;
          border-radius: 10px;
          white-space: nowrap;
        }
      }
    `,
    button2: css`
      margin-left: -1px;
    `,
  };
});
