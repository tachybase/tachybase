import { genStyleHook } from './../__builtins__';
export default genStyleHook('array-items', (token) => {
  const { componentCls, antCls, colorBgBase, fontSizeSM, colorBorder, colorText } = token;

  const itemCls = `${antCls}-formily-item`;
  return {
    [componentCls]: {
      [`${componentCls}-item-inner`]: {
        visibility: 'visible',
      },

      '&-item': {
        zIndex: 100000,
      },

      '&-card': {
        display: 'flex',
        border: `1px solid ${colorBorder}`,
        marginBottom: 10,
        padding: '3px 6px',
        background: colorBgBase,
        justifyContent: 'space-between',
        color: colorText,

        [`${itemCls}:not(${itemCls}-feedback-layout-popover)`]: {
          marginBottom: '0 !important',

          [`${itemCls}-help`]: {
            position: 'absolute',
            fontSize: fontSizeSM,
            top: '100%',
            background: colorBgBase,
            width: '100%',
            marginTop: 3,
            padding: 3,
            zIndex: 1,
            borderRadius: 3,
            boxShadow: `0 0 10px ${colorBorder}`,
          },
        },
      },

      '&-divide': {
        display: 'flex',
        borderBottom: `1px solid ${colorBorder}`,
        padding: '10px 0',
        justifyContent: 'space-between',

        [`${itemCls}:not(${itemCls}-feedback-layout-popover)`]: {
          marginBottom: '0 !important',

          [`${itemCls}-help`]: {
            position: 'absolute',
            fontSize: fontSizeSM,
            top: '100%',
            background: colorBgBase,
            width: '100%',
            marginTop: 3,
            padding: 3,
            zIndex: 1,
            borderRadius: 3,
            boxShadow: `0 0 10px ${colorBorder}`,
          },
        },
      },
    },
  };
});
