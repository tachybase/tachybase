import { genStyleHook } from './../__builtins__';

export default genStyleHook('array-base', (token) => {
  const { componentCls, colorText, fontSizeLG, colorPrimaryText, colorTextDisabled } = token;
  return {
    [componentCls]: {
      '&-remove, &-copy': {
        transition: 'all 0.25s ease-in-out',
        color: colorText,
        fontSize: fontSizeLG,

        ':hover': {
          color: colorPrimaryText,
        },

        '&-disabled': {
          color: colorTextDisabled,
          cursor: 'not-allowed !important',

          '&:hover': {
            color: colorTextDisabled,
          },
        },
      },

      '&-sort-handle': {
        cursor: 'move',
        color: '#888 !important',
      },

      '&-addition': {
        transition: 'all 0.25s ease-in-out',
      },

      '&-move-down, &-move-up': {
        transition: 'all 0.25s ease-in-out',
        color: colorText,
        fontSize: fontSizeLG,
        marginInlineStart: 6,

        ':hover': {
          color: colorPrimaryText,
        },

        '&-disabled': {
          color: colorTextDisabled,
          cursor: 'not-allowed !important',

          '&:hover': {
            color: colorTextDisabled,
          },
        },
      },
    },
  };
});
