import React, { PropsWithChildren } from 'react';
import { css, cx } from '@tachybase/client';

// import { useLocation } from 'react-router-dom';
import Device from './iOS6';

export const MobileDevice: React.FC<PropsWithChildren> = (props) => {
  return (
    <div
      className={cx(
        'tb-mobile-device-wrapper',
        css`
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 50px;
        `,
      )}
    >
      <Device
        className={css`
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);
        `}
        {...props}
      />
    </div>
  );
};
