import { genStyleHook } from '../__builtins__';

export default genStyleHook('array-cards', (token) => {
  const { componentCls, antCls } = token;
  const arrayBase = `${antCls}-formily-array-base`;
  return {
    [componentCls]: {
      '&-item': {
        marginBottom: '10px !important',
      },

      [`${arrayBase}-copy`]: {
        marginInlineStart: 6,
      },
    },
  };
});
