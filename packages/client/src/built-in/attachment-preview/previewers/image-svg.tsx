import React from 'react';

import { css } from '@emotion/css';
import { ReactSVG } from 'react-svg';

export const imageSvg = {
  key: 'image/svg+xml',
  type: 'image/svg+xml',
  viewComponet: (props) => {
    const { file, prefixCls } = props;
    return (
      file.imageUrl && (
        <ReactSVG
          src={`${file.url}`}
          className={`${prefixCls}-list-item-image ${css`
            svg {
              width: 100%;
              height: 100%;
            }
          `}`}
        />
      )
    );
  },
  checkedComponent: (props) => {
    const { file } = props;
    return (
      file.imageUrl && (
        <ReactSVG
          {...props}
          src={`${file.url}`}
          className={`${css`
            svg {
              width: 90%;
              height: auto;
              display: flex;
              justify-content: center;
              align-items: center;
            }
          `}`}
        />
      )
    );
  },
};
