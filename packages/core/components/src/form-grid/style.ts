import { genStyleHook } from './../__builtins__';

export default genStyleHook('form-grid', (token) => {
  const { componentCls } = token;
  return {
    [`${componentCls}-layout`]: {
      display: 'grid',
    },
  };
});
