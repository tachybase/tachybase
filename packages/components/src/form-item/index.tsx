import React, { useState } from 'react';
import { connect, isVoidField, mapProps, ReactFC } from '@tachybase/schema';

import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Popover, Tooltip } from 'antd';
import cx from 'classnames';

import { pickDataProps, usePrefixCls } from '../__builtins__';
import { FormLayoutShallowContext } from '../form-layout';
import { useFormItemLayout, useOverflow } from './hooks';
import useStyle from './style';
import { IFormItemProps } from './types';

export * from './hooks';
export * from './types';

type ComposeFormItem = ReactFC<IFormItemProps> & {
  BaseItem: ReactFC<IFormItemProps>;
};

const ICON_MAP = {
  error: <CloseCircleOutlined />,
  success: <CheckCircleOutlined />,
  warning: <ExclamationCircleOutlined />,
} as const;

export const BaseItem: React.FC<React.PropsWithChildren<IFormItemProps>> = ({ children, ...props }) => {
  const [active, setActive] = useState(false);
  const formLayout = useFormItemLayout(props);
  const { containerRef, contentRef, overflow } = useOverflow<HTMLDivElement, HTMLSpanElement>();
  const {
    label,
    style,
    layout,
    colon = true,
    addonBefore,
    addonAfter,
    asterisk,
    feedbackStatus,
    extra,
    feedbackText,
    fullness,
    feedbackLayout,
    feedbackIcon,
    getPopupContainer,
    inset,
    bordered = true,
    labelWidth,
    wrapperWidth,
    labelCol,
    wrapperCol,
    labelAlign,
    wrapperAlign = 'left',
    size,
    labelWrap,
    wrapperWrap,
    tooltipLayout,
    tooltip,
    tooltipIcon,
  } = formLayout;
  const labelStyle = { ...formLayout.labelStyle };
  const wrapperStyle = { ...formLayout.wrapperStyle };
  const prefixCls = usePrefixCls('formily-item', props);
  const [wrapSSR, hashId] = useStyle(prefixCls);
  // 固定宽度
  let enableCol = false;
  if (labelWidth || wrapperWidth) {
    if (labelWidth) {
      labelStyle.width = labelWidth === 'auto' ? undefined : labelWidth;
      labelStyle.maxWidth = labelWidth === 'auto' ? undefined : labelWidth;
    }
    if (wrapperWidth) {
      wrapperStyle.width = wrapperWidth === 'auto' ? undefined : wrapperWidth;
      wrapperStyle.maxWidth = wrapperWidth === 'auto' ? undefined : wrapperWidth;
    }
    // 栅格模式
  }
  if (labelCol || wrapperCol) {
    if (!labelStyle.width && !wrapperStyle.width && layout !== 'vertical') {
      enableCol = true;
    }
  }

  const formatChildren =
    feedbackLayout === 'popover' ? (
      <Popover
        autoAdjustOverflow
        overlayClassName={`${prefixCls}-popover`}
        placement="top"
        content={
          <div
            className={cx({
              [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
              [`${prefixCls}-help`]: true,
            })}
          >
            {feedbackStatus ? ICON_MAP[feedbackStatus] : null} {feedbackText}
          </div>
        }
        open={!!feedbackText}
        getPopupContainer={getPopupContainer}
      >
        <>{children}</>
      </Popover>
    ) : (
      children
    );

  const gridStyles: React.CSSProperties = {};

  const getOverflowTooltip = () => {
    if (overflow) {
      return (
        <div>
          <div>{label}</div>
          <div>{tooltip}</div>
        </div>
      );
    }
    return tooltip;
  };

  const renderLabelText = () => {
    const labelChildren = (
      <div className={`${prefixCls}-label-content`} ref={containerRef}>
        <span ref={contentRef}>
          {asterisk && <span className={`${prefixCls}-asterisk`}>{'*'}</span>}
          <label>{label}</label>
        </span>
      </div>
    );

    if ((tooltipLayout === 'text' && tooltip) || overflow) {
      return (
        <Tooltip placement="top" title={getOverflowTooltip()}>
          {labelChildren}
        </Tooltip>
      );
    }
    return labelChildren;
  };

  const renderTooltipIcon = () => {
    if (tooltip && tooltipLayout === 'icon' && !overflow) {
      return (
        <span className={`${prefixCls}-label-tooltip-icon`}>
          <Tooltip placement="top" title={tooltip}>
            {tooltipIcon}
          </Tooltip>
        </span>
      );
    }
  };

  const renderLabel = () => {
    if (!label) return null;
    return (
      <div
        className={cx({
          [`${prefixCls}-label`]: true,
          [`${prefixCls}-label-tooltip`]: (tooltip && tooltipLayout === 'text') || overflow,
          [`${prefixCls}-item-col-${labelCol}`]: enableCol && !!labelCol,
        })}
        style={labelStyle}
      >
        {renderLabelText()}
        {renderTooltipIcon()}
        {label !== ' ' && <span className={`${prefixCls}-colon`}>{colon ? ':' : ''}</span>}
      </div>
    );
  };

  return wrapSSR(
    <div
      {...pickDataProps(props)}
      style={{
        ...style,
        ...gridStyles,
      }}
      data-grid-span={props.gridSpan}
      className={cx(
        props.className,
        {
          [`${prefixCls}`]: true,
          [`${prefixCls}-layout-${layout}`]: true,
          [`${prefixCls}-${feedbackStatus}`]: !!feedbackStatus,
          [`${prefixCls}-feedback-has-text`]: !!feedbackText,
          [`${prefixCls}-size-${size}`]: !!size,
          [`${prefixCls}-feedback-layout-${feedbackLayout}`]: !!feedbackLayout,
          [`${prefixCls}-fullness`]: !!fullness || !!inset || !!feedbackIcon,
          [`${prefixCls}-inset`]: !!inset,
          [`${prefixCls}-active`]: active,
          [`${prefixCls}-inset-active`]: !!inset && active,
          [`${prefixCls}-label-align-${labelAlign}`]: true,
          [`${prefixCls}-control-align-${wrapperAlign}`]: true,
          [`${prefixCls}-label-wrap`]: !!labelWrap,
          [`${prefixCls}-control-wrap`]: !!wrapperWrap,
          [`${prefixCls}-bordered-none`]: bordered === false || !!inset || !!feedbackIcon,
        },
        hashId,
      )}
      onFocus={() => {
        if (feedbackIcon || inset) {
          setActive(true);
        }
      }}
      onBlur={() => {
        if (feedbackIcon || inset) {
          setActive(false);
        }
      }}
    >
      {renderLabel()}
      <div
        className={cx({
          [`${prefixCls}-control`]: true,
          [`${prefixCls}-item-col-${wrapperCol}`]: enableCol && !!wrapperCol && label,
        })}
      >
        <div className={cx(`${prefixCls}-control-content`)}>
          {addonBefore && <div className={cx(`${prefixCls}-addon-before`)}>{addonBefore}</div>}
          <div
            style={wrapperStyle}
            className={cx({
              [`${prefixCls}-control-content-component`]: true,
              [`${prefixCls}-control-content-component-has-feedback-icon`]: !!feedbackIcon,
            })}
          >
            <FormLayoutShallowContext.Provider value={{}}>{formatChildren}</FormLayoutShallowContext.Provider>
            {feedbackIcon && <div className={cx(`${prefixCls}-feedback-icon`)}>{feedbackIcon}</div>}
          </div>
          {addonAfter && <div className={cx(`${prefixCls}-addon-after`)}>{addonAfter}</div>}
        </div>
        {!!feedbackText && feedbackLayout !== 'popover' && feedbackLayout !== 'none' && (
          <div
            className={cx({
              [`${prefixCls}-${feedbackStatus}-help`]: !!feedbackStatus,
              [`${prefixCls}-help`]: true,
              [`${prefixCls}-help-enter`]: true,
              [`${prefixCls}-help-enter-active`]: true,
            })}
          >
            {feedbackText}
          </div>
        )}
        {extra && <div className={cx(`${prefixCls}-extra`)}>{extra}</div>}
      </div>
    </div>,
  );
};

// 适配
export const FormItem: ComposeFormItem = Object.assign(
  connect(
    BaseItem,
    mapProps((props, field) => {
      if (isVoidField(field))
        return {
          label: field.title || props.label,
          asterisk: props.asterisk,
          extra: props.extra || field.description,
        };
      if (!field) return props;
      const takeFeedbackStatus = () => {
        if (field.validating) return 'pending';
        return field.decoratorProps.feedbackStatus || field.validateStatus;
      };
      const takeMessage = () => {
        const split = (messages: any[]) => {
          return messages.reduce((buf, text, index) => {
            if (!text) return buf;
            return index < messages.length - 1 ? buf.concat([text, ', ']) : buf.concat([text]);
          }, []);
        };
        if (field.validating) return;
        if (props.feedbackText) return props.feedbackText;
        if (field.selfErrors.length) return split(field.selfErrors);
        if (field.selfWarnings.length) return split(field.selfWarnings);
        if (field.selfSuccesses.length) return split(field.selfSuccesses);
      };
      const takeAsterisk = () => {
        if ('asterisk' in props) {
          return props.asterisk;
        }
        if (field.required && field.pattern !== 'readPretty') {
          return true;
        }
        return false;
      };
      return {
        label: props.label || field.title,
        feedbackStatus: takeFeedbackStatus(),
        feedbackText: takeMessage(),
        asterisk: takeAsterisk(),
        extra: props.extra || field.description,
      };
    }),
  ),
  {
    BaseItem,
  },
);

export default FormItem;
