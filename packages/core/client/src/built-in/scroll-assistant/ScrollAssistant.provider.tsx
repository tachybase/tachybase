import React, { useRef } from 'react';

import { css } from '@emotion/css';

import { useScrollAssistantStatus } from './ScrollAssistantStatus.provider';
import { useJoystick } from './useJoystick';

export const ScrollAssistantProvider = ({ children }) => {
  const { enable } = useScrollAssistantStatus();
  const ref = useRef<HTMLDivElement>() as any;
  useJoystick(ref);
  return (
    <>
      {children}
      {enable && (
        <div
          ref={ref}
          className={css`
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            z-index: 30;
            width: 100vw;
            height: 100vh;
            background-color: rgba(141, 141, 113, 0.274);
          `}
        ></div>
      )}
    </>
  );
};
