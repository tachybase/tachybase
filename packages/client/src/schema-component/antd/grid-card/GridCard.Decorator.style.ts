import { genStyleHook } from '../__builtins__';

const useStyles = genStyleHook('tb-grid-card', (token) => {
  const { componentCls } = token;
  return {
    [componentCls]: {
      '& > .tb-block-item': {
        marginBottom: token.marginLG,
        '& > .tb-action-bar:has(:first-child:not(:empty))': {
          padding: token.marginLG,
          background: token.colorBgContainer,
        },
        '.ant-list-pagination': { padding: token.marginLG, background: token.colorBgContainer },
      },
      '.ant-formily-item-feedback-layout-loose': { marginBottom: token.marginSM },
    },
  };
});

export default useStyles;
