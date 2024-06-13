import { Keyframes } from '@ant-design/cssinjs';

import { GenerateStyle } from '../../__builtins__';

const antShowHelpIn = new Keyframes('antShowHelpIn', {
  '0%': {
    transform: 'translateY(-5px)',
    opacity: 0,
  },
  to: {
    transform: ' translateY(0)',
    opacity: 1,
  },
});

export const getAnimationStyle: GenerateStyle = (token) => {
  const { componentCls } = token;
  const helpCls = `${componentCls}-help`;

  return {
    [helpCls]: {
      '&-appear, &-enter': {
        animationDuration: '0.3s',
        animationFillMode: 'both',
        animationPlayState: 'paused',
        opacity: 0,
        animationTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',

        '&-active': {
          animationPlayState: 'running',
          animationName: antShowHelpIn,
        },
      },
    },
  };
};
