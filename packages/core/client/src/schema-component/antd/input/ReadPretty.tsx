import React from 'react';
import { usePrefixCls } from '@tachybase/components';

import { Typography } from 'antd';
import { InputProps, TextAreaProps } from 'antd/es/input';
import cls from 'classnames';

import { useCompile } from '../..';
import { EllipsisWithTooltip } from './EllipsisWithTooltip';
import { HTMLEncode } from './shared';

export const ReadPretty = () => null;

const _Input = (props: InputProps & { ellipsis?: any }) => {
  const prefixCls = usePrefixCls('description-input', props);
  const compile = useCompile();
  return (
    <div className={cls(prefixCls, props.className)} style={props.style}>
      {props.addonBefore}
      {props.prefix}
      <EllipsisWithTooltip ellipsis={props.ellipsis}>{compile(props.value)}</EllipsisWithTooltip>
      {props.suffix}
      {props.addonAfter}
    </div>
  );
};

const _TextArea = (
  props: TextAreaProps & {
    ellipsis?: any;
    text?: any;
    addonBefore?: any;
    suffix?: any;
    addonAfter?: any;
    autop?: boolean;
  },
) => {
  const prefixCls = usePrefixCls('description-textarea', props);
  const compile = useCompile();
  const value = compile(props.value ?? '');
  const { autop = true, ellipsis, text } = props;
  const html = (
    <div
      style={{ lineHeight: 1.612 }}
      dangerouslySetInnerHTML={{
        __html: HTMLEncode(value).split('\n').join('<br/>'),
      }}
    />
  );

  const content = ellipsis ? (
    <EllipsisWithTooltip ellipsis={ellipsis} popoverContent={autop ? html : value}>
      {text || value}
    </EllipsisWithTooltip>
  ) : autop ? (
    html
  ) : (
    value
  );
  return (
    <div className={cls(prefixCls, props.className)} style={{ overflowWrap: 'break-word', ...props.style }}>
      {props.addonBefore}
      {props.prefix}
      {content}
      {props.suffix}
      {props.addonAfter}
    </div>
  );
};

function convertToText(html: string) {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  const text = temp.innerText;
  return text?.replace(/[\n\r]/g, '') || '';
}

const _Html = (props: InputProps & { autop: boolean; ellipsis: boolean }) => {
  const prefixCls = usePrefixCls('description-textarea', props);
  const compile = useCompile();
  const value = compile(props.value ?? '');
  const { autop = true, ellipsis } = props;
  const html = (
    <div
      dangerouslySetInnerHTML={{
        __html: value,
      }}
    />
  );
  const text = convertToText(value);
  const content = (
    <EllipsisWithTooltip ellipsis={ellipsis} popoverContent={autop ? html : value}>
      {ellipsis ? text : html}
    </EllipsisWithTooltip>
  );
  return (
    <div className={cls(prefixCls, props.className)} style={{ overflowWrap: 'break-word', ...props.style }}>
      {props.addonBefore}
      {props.prefix}
      {content}
      {props.suffix}
      {props.addonAfter}
    </div>
  );
};

const _URL = (props: InputProps) => {
  const prefixCls = usePrefixCls('description-url', props);
  const content = props.value && (
    <Typography.Link ellipsis target={'_blank'} href={props.value as any}>
      {props.value?.toString()}
    </Typography.Link>
  );
  return (
    <div className={cls(prefixCls, props.className)} style={props.style}>
      {props.addonBefore}
      {props.prefix}
      {content}
      {props.suffix}
      {props.addonAfter}
    </div>
  );
};

ReadPretty.Input = _Input;
ReadPretty.TextArea = _TextArea;
ReadPretty.URL = _URL;
ReadPretty.Html = _Html;
ReadPretty.TextArea = _TextArea;
