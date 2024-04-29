import { isArr, isValid } from '@formily/shared';
import { useEffect, useRef, useState } from 'react';

interface IProps {
  breakpoints?: number[];
  layout?: 'vertical' | 'horizontal' | 'inline' | ('vertical' | 'horizontal' | 'inline')[];
  labelCol?: number | number[];
  wrapperCol?: number | number[];
  labelAlign?: 'right' | 'left' | ('right' | 'left')[];
  wrapperAlign?: 'right' | 'left' | ('right' | 'left')[];
  [props: string]: any;
}

interface ICalcBreakpointIndex {
  (originalBreakpoints: number[] | undefined, width: number): number | undefined;
}

interface ICalculateProps {
  (target: HTMLElement, props: IProps): IProps;
}

interface IUseResponsiveFormLayout {
  (props: IProps): {
    ref: React.RefObject<HTMLDivElement>;
    props: any;
  };
}

const calcBreakpointIndex: ICalcBreakpointIndex = (breakpoints, width) => {
  if (!breakpoints) return;
  for (let i = 0; i < breakpoints.length; i++) {
    if (width <= breakpoints[i]) {
      return i;
    }
  }
};

const calcFactor = <T>(value: T | T[], breakpointIndex?: number): T => {
  if (Array.isArray(value)) {
    if (breakpointIndex === -1) return value[0];
    return value[breakpointIndex || value.length - 1] ?? value[value.length - 1];
  } else {
    return value;
  }
};

const factor = <T>(value: T | T[], breakpointIndex?: number): T =>
  isValid(value) ? calcFactor(value as any, breakpointIndex) : value;

const calculateProps: ICalculateProps = (target, props) => {
  const { clientWidth } = target;
  const { breakpoints, layout, labelAlign, wrapperAlign, labelCol, wrapperCol, ...otherProps } = props;
  const breakpointIndex = calcBreakpointIndex(breakpoints, clientWidth);

  return {
    layout: factor(layout, breakpointIndex),
    labelAlign: factor(labelAlign, breakpointIndex),
    wrapperAlign: factor(wrapperAlign, breakpointIndex),
    labelCol: factor(labelCol, breakpointIndex),
    wrapperCol: factor(wrapperCol, breakpointIndex),
    ...otherProps,
  };
};

export const useResponsiveFormLayout: IUseResponsiveFormLayout = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { breakpoints } = props;
  const [layoutProps, setLayout] = useState<any>(props);

  const updateUI = () => {
    if (ref.current) {
      setLayout(calculateProps(ref.current, props));
    }
  };

  useEffect(() => {
    const observer = () => {
      updateUI();
    };
    const resizeObserver = new ResizeObserver(observer);
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    updateUI();
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  if (!isArr(breakpoints)) {
    return { ref, props };
  }

  return {
    ref,
    props: layoutProps,
  };
};
