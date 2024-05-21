import { genStyleHook } from '@tachybase/client';

export const styles = genStyleHook('nb-comment', (tokens) => {
  const { componentCls } = tokens;
  return {
    [componentCls]: {
      [`${componentCls}-item-container-container`]: {
        '&:first-child': { border: '5px solid #d0d7deb3', position: 'relative', zIndex: 1, borderRadius: 8 },
      },
      [`${componentCls}-item-container-border`]: {
        border: '1px solid #d0d7deb3',
        position: 'relative',
        zIndex: 1,
        borderRadius: 8,
      },
      [`${componentCls}-item-container-line`]: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        content: '',
        display: 'block',
        width: 2,
        left: 16,
        backgroundColor: '#d0d7deb3',
        zIndex: 0,
      },
      '.ant-list-pagination': { marginTop: tokens.marginXS },
      '.ant-card-head': { padding: '0 !important', fontWeight: 'normal', backgroundColor: '#f6f8fa' },
      [`${componentCls}-item-title`]: {
        color: '#636c76',
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 16,
        borderRadius: '8px 8px 0 0 ',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        [`${componentCls}-item-title-left`]: {
          backgroundColor: '#f6f8fa',
          color: '#636c76',
          display: 'flex',
          alignItems: 'center',
          columnGap: 6,
          'span:first-child': { fontWeight: 'bold', fontSize: 14 },
          'span:not(:first-child)': { fontWeight: 'normal', fontSize: 14 },
        },
        [`${componentCls}-item-title-right`]: { marginRight: 16, flexShrink: 0 },
      },
      [`${componentCls}-item-editor`]: {
        position: 'relative',
        zIndex: 2,
        backgroundColor: 'white',
        borderRadius: '0 0 8px 8px',
        [`${componentCls}-item-editor-button-area`]: { marginTop: 10, display: 'flex', columnGap: 5 },
      },
    },
  };
});
