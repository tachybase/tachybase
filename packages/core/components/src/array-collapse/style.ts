import { genStyleHook } from './../__builtins__';

export default genStyleHook('', (token) => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      '&-item': {
        marginBottom: '10px !important',
      },
    },
  };
});
