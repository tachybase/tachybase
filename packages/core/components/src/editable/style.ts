import { genStyleHook } from './../__builtins__';
export default genStyleHook('editable', (token) => {
  const { antCls, componentCls, fontSizeSM, colorPrimary } = token;
  return {
    [componentCls]: {
      cursor: 'pointer',
      display: 'inline-block !important',

      [`${antCls}-form-text`]: {
        display: 'flex',
        alignItems: 'center',

        [`${antCls}-tag`]: {
          transition: 'none !important',
        },

        [`${antCls}-tag:last-child`]: {
          paddingInlineEnd: '0 !important',
        },
      },

      [`${componentCls}-content`]: {
        display: 'flex',
        alignItems: 'center',
        '> *': {
          marginInlineEnd: 3,

          '&:last-child': {
            marginInlineEnd: 0,
          },
        },
      },

      [`${componentCls}-edit-btn,
        ${componentCls}-close-btn`]: {
        transition: 'all .25s ease-in-out',
        color: '#aaa',
        fontSize: fontSizeSM,

        '&:hover': {
          color: colorPrimary,
        },
      },

      [`${componentCls}-preview`]: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        wordBreak: 'break-all',
        maxWidth: '100%',
        display: 'block',
      },
    },
  };
});
