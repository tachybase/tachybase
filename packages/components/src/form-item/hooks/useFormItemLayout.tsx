import React from 'react';

import { QuestionCircleOutlined } from '@ant-design/icons';

import { useFormLayout } from '../../form-layout';
import { IFormItemProps } from '../types';

export const useFormItemLayout = (props: IFormItemProps) => {
  const layout = useFormLayout();
  const layoutType = props.layout ?? layout.layout ?? 'horizontal';
  return {
    ...props,
    layout: layoutType,
    colon: props.colon ?? layout.colon,
    labelAlign:
      layoutType === 'vertical' ? props.labelAlign ?? 'left' : props.labelAlign ?? layout.labelAlign ?? 'right',
    labelWrap: props.labelWrap ?? layout.labelWrap,
    labelWidth: props.labelWidth ?? layout.labelWidth,
    wrapperWidth: props.wrapperWidth ?? layout.wrapperWidth,
    labelCol: props.labelCol ?? layout.labelCol,
    wrapperCol: props.wrapperCol ?? layout.wrapperCol,
    wrapperAlign: props.wrapperAlign ?? layout.wrapperAlign,
    wrapperWrap: props.wrapperWrap ?? layout.wrapperWrap,
    fullness: props.fullness ?? layout.fullness,
    size: props.size ?? layout.size,
    inset: props.inset ?? layout.inset,
    asterisk: props.asterisk,
    bordered: props.bordered ?? layout.bordered,
    feedbackIcon: props.feedbackIcon,
    feedbackLayout: props.feedbackLayout ?? layout.feedbackLayout ?? 'loose',
    tooltipLayout: props.tooltipLayout ?? layout.tooltipLayout ?? 'icon',
    tooltipIcon: props.tooltipIcon ?? layout.tooltipIcon ?? <QuestionCircleOutlined />,
  };
};
