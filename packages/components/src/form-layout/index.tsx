import React, { createContext, useContext } from 'react';

import cls from 'classnames';

import { usePrefixCls } from '../__builtins__';
import { useResponsiveFormLayout } from './useResponsiveFormLayout';

export interface IFormLayoutProps {
  prefixCls?: string;
  className?: string;
  style?: React.CSSProperties;
  colon?: boolean;
  labelAlign?: 'right' | 'left' | ('right' | 'left')[];
  wrapperAlign?: 'right' | 'left' | ('right' | 'left')[];
  labelWrap?: boolean;
  labelWidth?: number;
  wrapperWidth?: number;
  wrapperWrap?: boolean;
  labelCol?: number | number[];
  wrapperCol?: number | number[];
  fullness?: boolean;
  size?: 'small' | 'default' | 'large';
  layout?: 'vertical' | 'horizontal' | 'inline' | ('vertical' | 'horizontal' | 'inline')[];
  direction?: 'rtl' | 'ltr';
  inset?: boolean;
  shallow?: boolean;
  tooltipLayout?: 'icon' | 'text';
  tooltipIcon?: React.ReactNode;
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none';
  bordered?: boolean;
  breakpoints?: number[];
  spaceGap?: number;
  gridColumnGap?: number;
  gridRowGap?: number;
}

export interface IFormLayoutContext
  extends Omit<IFormLayoutProps, 'labelAlign' | 'wrapperAlign' | 'layout' | 'labelCol' | 'wrapperCol'> {
  labelAlign?: 'right' | 'left';
  wrapperAlign?: 'right' | 'left';
  layout?: 'vertical' | 'horizontal' | 'inline';
  labelCol?: number;
  wrapperCol?: number;
}

export const FormLayoutDeepContext = createContext<IFormLayoutContext>({});

export const FormLayoutShallowContext = createContext<IFormLayoutContext>({});

export const useFormDeepLayout = () => useContext(FormLayoutDeepContext);

export const useFormShallowLayout = () => useContext(FormLayoutShallowContext);

export const useFormLayout = () => ({
  ...useFormDeepLayout(),
  ...useFormShallowLayout(),
});

export const FormLayout: React.FC<React.PropsWithChildren<IFormLayoutProps>> & {
  useFormLayout: () => IFormLayoutContext;
  useFormDeepLayout: () => IFormLayoutContext;
  useFormShallowLayout: () => IFormLayoutContext;
} = ({ shallow = true, children, prefixCls, className, style, ...otherProps }) => {
  const { ref, props } = useResponsiveFormLayout(otherProps);
  const deepLayout = useFormDeepLayout();
  const formPrefixCls = usePrefixCls('form', { prefixCls });
  const layoutPrefixCls = usePrefixCls('formily-layout', { prefixCls });
  const layoutClassName = cls(
    layoutPrefixCls,
    {
      [`${formPrefixCls}-${props.layout}`]: true,
      [`${formPrefixCls}-rtl`]: props.direction === 'rtl',
      [`${formPrefixCls}-${props.size}`]: props.size,
    },
    className,
  );
  const renderChildren = () => {
    const newDeepLayout = {
      ...deepLayout,
    };
    if (!shallow) {
      Object.assign(newDeepLayout, props);
    } else {
      if (props.size) {
        newDeepLayout.size = props.size;
      }
      if (props.colon) {
        newDeepLayout.colon = props.colon;
      }
    }
    return (
      <FormLayoutDeepContext.Provider value={newDeepLayout}>
        <FormLayoutShallowContext.Provider value={shallow ? props : undefined}>
          {children}
        </FormLayoutShallowContext.Provider>
      </FormLayoutDeepContext.Provider>
    );
  };
  return (
    <div ref={ref} className={layoutClassName} style={style}>
      {renderChildren()}
    </div>
  );
};

FormLayout.useFormDeepLayout = useFormDeepLayout;
FormLayout.useFormShallowLayout = useFormShallowLayout;
FormLayout.useFormLayout = useFormLayout;

export default FormLayout;
