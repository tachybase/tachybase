import { GenerateStyle, genStyleHook } from '../../__builtins__';
import { getAnimationStyle } from './animation';
import { getGridStyle } from './grid';
import { genOtherStyle } from './other';

const genSmallStyle: GenerateStyle = (token) => {
  const { componentCls, antCls, controlHeightSM, marginLG, fontSizeSM, lineHeightSM } = token;
  return {
    fontSize: fontSizeSM,
    lineHeight: controlHeightSM,
    [`${componentCls}-label`]: {
      lineHeight: `${controlHeightSM}px`,
      minHeight: controlHeightSM - 4,

      '> label': {
        height: controlHeightSM - 2,
      },
    },

    [`${componentCls}-control-content`]: {
      ' &-component': {
        minHeight: controlHeightSM - 4,
        lineHeight: lineHeightSM,
      },
    },

    [`${componentCls}-help,
      ${componentCls}-extra`]: {
      minHeight: controlHeightSM - 4,
      lineHeight: `${controlHeightSM - 4}px`,
    },

    [`${componentCls}-control-content`]: {
      minHeight: controlHeightSM - 4,
    },

    [`${antCls}-input-affix-wrapper,
      ${antCls}-input-number,
      ${antCls}-picker`]: {
      padding: `0px 11px`,

      input: {
        height: controlHeightSM - 4,
        fontSize: fontSizeSM,
      },
    },

    [`${antCls}-cascader-picker`]: {
      height: controlHeightSM - 4,

      input: {
        padding: '0 7px',
        height: controlHeightSM - 4,
        fontSize: fontSizeSM,
      },
    },

    [`${antCls}-select-single:not(${antCls}-select-customize-input) ${antCls}-select-selector`]: {
      padding: `0px 11px`,
      height: controlHeightSM - 4,
      fontSize: fontSizeSM,
      lineHeight: `${controlHeightSM}px`,

      [`${antCls}-select-selection-search`]: {
        height: controlHeightSM,
        lineHeight: `${controlHeightSM - 4}px`,

        '&-input': {
          height: controlHeightSM - 4,
          lineHeight: `${controlHeightSM - 4}px`,
        },
      },

      [`${antCls}-select-selection-placeholder`]: {
        height: controlHeightSM,
        lineHeight: `${controlHeightSM - 4}px`,
      },

      [`${antCls}-select-selection-item`]: {
        height: controlHeightSM,
        lineHeight: `${controlHeightSM - 4}px`,
      },
      [`${antCls}-select-multiple:not(${antCls}-select-customize-input)
          ${antCls}-select-selector`]: {
        padding: '0px 2px',
        height: controlHeightSM - 4,
        fontSize: fontSizeSM,
        lineHeight: `${controlHeightSM}px`,

        '&::after': {
          height: controlHeightSM - 8,
          lineHeight: `${controlHeightSM - 8}px`,
        },

        [`${antCls}-select-selection-search`]: {
          height: controlHeightSM - 8,
          lineHeight: `${controlHeightSM - 8}px`,
          marginInlineStart: 0,

          '&-input': {
            height: controlHeightSM,
            lineHeight: `${controlHeightSM - 4}px`,
          },
        },

        [`${antCls}-select-selection-placeholder`]: {
          height: controlHeightSM - 4,
          lineHeight: `${controlHeightSM}px`,
          marginInlineStart: 4,
        },

        [`${antCls}-select-selection-overflow-item`]: {
          alignSelf: 'flex-start',

          [`${antCls}-select-selection-item`]: {
            lineHeight: `${controlHeightSM - 10}px`,
            height: controlHeightSM - 8,
          },
        },
      },

      [`&${componentCls}-feedback-layout-terse`]: {
        marginBottom: 8,

        [`&${componentCls}-feedback-has-text:not(${componentCls}-inset)`]: {
          marginBottom: 0,
        },
      },

      [`&${componentCls}-feedback-layout-loose`]: {
        marginBottom: marginLG,

        [`&${componentCls}-feedback-has-text:not(${componentCls}-inset)`]: {
          marginBottom: 0,
        },
      },
    },
  };
};

const genLargeStyle: GenerateStyle = (token) => {
  const { componentCls, antCls, fontSizeLG, controlHeightLG, controlHeightSM, marginLG, lineHeightLG } = token;
  return {
    fontSize: fontSizeLG,
    lineHeight: `${controlHeightLG}px`,
    [`${componentCls}-label`]: {
      lineHeight: `${controlHeightLG}px`,
      minHeight: controlHeightLG - 2,

      '> label': {
        height: controlHeightLG,
      },
    },

    [`${componentCls}-control-content`]: {
      ' &-component': {
        minHeight: controlHeightLG - 2,
        lineHeight: lineHeightLG,
      },
    },

    [`${componentCls}-help,
      ${componentCls}-extra`]: {
      minHeight: controlHeightSM,
      lineHeight: `${controlHeightSM}px`,
    },

    [`${componentCls}-control-content`]: {
      minHeight: controlHeightLG - 2,
    },

    [`${antCls}-input`]: {
      fontSize: fontSizeLG,
    },

    [`${antCls}-input-number`]: {
      fontSize: fontSizeLG,

      input: {
        height: controlHeightLG - 2,
      },
    },

    [`${antCls}-input-affix-wrapper,
      ${antCls}-picker`]: {
      padding: `0px 11px`,
      lineHeight: `${controlHeightLG - 2}px`,
      input: {
        height: controlHeightLG - 2,
        fontSize: fontSizeLG,
      },
    },

    [`${antCls}-btn`]: {
      height: controlHeightLG,
      padding: '0 8px',
    },

    [`${antCls}-radio-button-wrapper`]: {
      height: controlHeightLG,
      lineHeight: `${controlHeightLG}px`,
    },

    [`${antCls}-cascader-picker`]: {
      height: controlHeightLG - 2,

      input: {
        padding: '0 11px',
        height: controlHeightLG - 2,
        fontSize: fontSizeLG,
      },
    },

    [`${antCls}-select-single:not(${antCls}-select-customize-input) ${antCls}-select-selector`]: {
      padding: `0px 11px`,
      height: controlHeightLG,
      fontSize: fontSizeLG,
      lineHeight: `${controlHeightLG}px`,

      [`${antCls}-select-selection-search`]: {
        height: controlHeightLG,
        lineHeight: `${controlHeightLG - 2}px`,

        '&-input': {
          height: controlHeightLG,
          lineHeight: `${controlHeightLG - 2}px`,
        },
      },

      [`${antCls}-select-selection-placeholder`]: {
        height: controlHeightLG,
        lineHeight: `${controlHeightLG}px`,
      },

      [`${antCls}-select-selection-item`]: {
        height: controlHeightLG,
        lineHeight: `${controlHeightLG}px`,
      },
      [`${antCls}-select-multiple:not(${antCls}-select-customize-input)
          ${antCls}-select-selector`]: {
        padding: '0px 2px',
        height: controlHeightLG - 2,
        fontSize: fontSizeLG,
        lineHeight: `${controlHeightLG}px`,

        '&::after': {
          height: controlHeightLG - 8,
          lineHeight: `${controlHeightLG - 8}px`,
        },

        [`${antCls}-select-selection-search`]: {
          height: controlHeightLG - 8,
          lineHeight: `${controlHeightLG - 8}px`,

          '&-input': {
            height: controlHeightLG - 12,
            lineHeight: `${controlHeightLG - 12}px`,
          },
        },

        [`${antCls}-select-selection-placeholder`]: {
          height: controlHeightLG - 8,
          lineHeight: `${controlHeightLG - 8}px`,
        },

        [`${antCls}-select-selection-overflow-item`]: {
          alignSelf: 'flex-start',

          [`${antCls}-select-selection-item`]: {
            lineHeight: `${controlHeightLG - 10}px`,
            height: controlHeightLG - 8,
          },
        },
      },

      [`&${componentCls}-feedback-layout-terse`]: {
        marginBottom: 8,

        [`&${componentCls}-feedback-has-text:not(${componentCls}-inset)`]: {
          marginBottom: 0,
        },
      },

      [`&${componentCls}-feedback-layout-loose`]: {
        marginBottom: marginLG,

        [`&${componentCls}-feedback-has-text:not(${componentCls}-inset)`]: {
          marginBottom: 0,
        },
      },
    },
  };
};

const genLabelStyle: GenerateStyle = (token) => {
  const { componentCls, controlHeight, controlHeightSM, marginLG, marginSM, lineHeight } = token;
  return {
    lineHeight: `${controlHeight}px`,
    minHeight: controlHeight - 2,
    position: 'relative',
    display: 'flex',
    color: token.colorTextHeading,

    label: {
      cursor: 'text',
    },

    '&-content': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      label: {
        whiteSpace: 'nowrap',
      },
    },

    '&-tooltip': {
      cursor: 'help',
      '*': {
        cursor: 'help',
      },
      label: {
        borderBottom: '1px dashed currentColor',
      },
    },

    '&-feedback-layout': {
      '&-terse': {
        marginBottom: marginSM,
      },

      '&-loose': {
        marginBottom: marginLG,
      },

      '&-none': {
        marginBottom: 0,
      },

      '&-terse, &-loosee, &-none': {
        [`&.${componentCls}-feedback-has-text:not(${componentCls}-inset)`]: {
          marginBottom: 0,
        },
      },
    },

    '&-control': {
      flex: 1,
      maxWidth: '100%',

      [`&.${componentCls}-control-content`]: {
        display: 'flex',

        '&-component': {
          width: '100%',
          minHeight: controlHeight - 2,
          lineHeight: lineHeight,

          '&-has-feedback-icon': {
            flex: 1,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
          },
        },

        [`${componentCls}-addon`]: {
          '&-before': {
            marginInlineEnd: marginSM,
          },

          '&-after': {
            marginInlineEnd: marginSM,
          },

          '&-before, &-after': {
            display: 'inline-flex',
            alignItems: 'center',
            minHeight: controlHeight,
            flexShrink: 0,
          },
        },
      },

      [`${componentCls}-help,
        ${componentCls}-extra`]: {
        minHeight: controlHeightSM,
        lineHeight: `${controlHeightSM}px`,
        color: token.colorTextSecondary,
      },
    },
  };
};

const genFormItemStyle: GenerateStyle = (token) => {
  const { componentCls, fontSize, marginLG } = token;
  return {
    [componentCls]: {
      display: 'flex',
      position: 'relative',
      marginBottom: marginLG,
      fontSize: fontSize,

      [`${componentCls}-label`]: genLabelStyle(token),

      [`&${componentCls}-size-small`]: genSmallStyle(token),

      [`&${componentCls}-size-large`]: genLargeStyle(token),

      '&-label': {
        '&-align': {
          [`&-left`]: {
            [`> ${componentCls}-label`]: {
              justifyContent: 'flex-start',
            },
          },

          [`&-right`]: {
            [`> ${componentCls}-label`]: {
              justifyContent: 'flex-end',
            },
          },
        },
        ['&-wrap']: {
          [`${componentCls}-label`]: {
            label: {
              whiteSpace: 'pre-line',
              wordBreak: 'break-all',
            },
          },
        },
      },
    },
  };
};

export default genStyleHook('Form', (token) => {
  return [genFormItemStyle(token), getAnimationStyle(token), genOtherStyle(token), getGridStyle(token)];
});
