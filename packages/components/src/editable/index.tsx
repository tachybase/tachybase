import React, { useLayoutEffect, useRef, useState } from 'react';
import { Field, isVoidField, observer, ReactFC, useField } from '@tachybase/schema';

import { CloseOutlined, EditOutlined, MessageOutlined } from '@ant-design/icons';
import { Popover as AntdPopover } from 'antd';
import { PopoverProps } from 'antd/lib/popover';
import cls from 'classnames';

import { useClickAway, usePrefixCls } from '../__builtins__';
import { BaseItem, IFormItemProps } from '../form-item';
import useStyle from './style';

const useParentPattern = () => {
  const field = useField<Field>();
  return field?.parent?.pattern || field?.form?.pattern;
};

const useEditable = (): [boolean, (payload: boolean) => void] => {
  const pattern = useParentPattern();
  const field = useField<Field>();
  useLayoutEffect(() => {
    if (pattern === 'editable') {
      return field.setPattern('readPretty');
    }
  }, [pattern]);
  return [
    field.pattern === 'editable',
    (payload: boolean) => {
      if (pattern !== 'editable') return;
      field.setPattern(payload ? 'editable' : 'readPretty');
    },
  ];
};

const useFormItemProps = (): IFormItemProps => {
  const field = useField();
  if (isVoidField(field)) return {};
  if (!field) return {};
  const takeMessage = () => {
    if (field.selfErrors.length) return field.selfErrors;
    if (field.selfWarnings.length) return field.selfWarnings;
    if (field.selfSuccesses.length) return field.selfSuccesses;
  };

  return {
    feedbackStatus: field.validateStatus === 'validating' ? 'pending' : field.validateStatus,
    feedbackText: takeMessage(),
    extra: field.description,
  };
};

const InternalEditable: ReactFC<IFormItemProps> = observer((props) => {
  const [editable, setEditable] = useEditable();
  const pattern = useParentPattern();
  const itemProps = useFormItemProps();
  const field = useField<Field>();
  const basePrefixCls = usePrefixCls();
  const prefixCls = usePrefixCls('formily-editable');
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const ref = useRef<boolean>();
  const innerRef = useRef<HTMLDivElement>(null);
  const recover = () => {
    if (ref.current && !field?.errors?.length) {
      setEditable(false);
    }
  };
  const renderEditHelper = () => {
    if (editable) return;
    return (
      <BaseItem {...props} {...itemProps}>
        {pattern === 'editable' && <EditOutlined className={`${prefixCls}-edit-btn`} />}
        {pattern !== 'editable' && <MessageOutlined className={`${prefixCls}-edit-btn`} />}
      </BaseItem>
    );
  };

  const renderCloseHelper = () => {
    if (!editable) return;
    return (
      <BaseItem {...props}>
        <CloseOutlined className={`${prefixCls}-close-btn`} />
      </BaseItem>
    );
  };

  useClickAway((e) => {
    const target = e.target as HTMLElement;
    if (target?.closest(`.${basePrefixCls}-select-dropdown`)) return;
    if (target?.closest(`.${basePrefixCls}-picker-dropdown`)) return;
    if (target?.closest(`.${basePrefixCls}-cascader-menus`)) return;
    recover();
  }, innerRef);

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLElement;
    const close = innerRef.current?.querySelector(`.${prefixCls}-close-btn`) || null;
    if (target?.contains(close) || close?.contains(target)) {
      recover();
    } else if (!ref.current) {
      setTimeout(() => {
        setEditable(true);
        setTimeout(() => {
          innerRef.current?.querySelector('input')?.focus();
        });
      });
    }
  };

  ref.current = editable;

  return wrapSSR(
    <div className={cls(prefixCls, hashId)} ref={innerRef} onClick={onClick}>
      <div className={`${prefixCls}-content`}>
        <BaseItem {...props} {...itemProps}>
          {props.children}
        </BaseItem>
        {renderEditHelper()}
        {renderCloseHelper()}
      </div>
    </div>,
  );
});

const Popover = observer((props: PopoverProps) => {
  const field = useField<Field>();
  const pattern = useParentPattern();
  const [open, setOpen] = useState(false);
  const prefixCls = usePrefixCls('formily-editable');
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const closePopover = async () => {
    try {
      await field.form.validate(`${field.address}.*`);
    } finally {
      const errors = field.form.queryFeedbacks({
        type: 'error',
        address: `${field.address}.*`,
      });
      if (!errors?.length) {
        setOpen(false);
      }
    }
  };
  const openPopover = () => {
    setOpen(true);
  };
  return wrapSSR(
    <AntdPopover
      {...props}
      title={props.title || field.title}
      open={open}
      className={cls(prefixCls, hashId, props.className)}
      content={props.children}
      trigger="click"
      destroyTooltipOnHide
      onOpenChange={(open) => {
        if (open) {
          openPopover();
        } else {
          closePopover();
        }
      }}
    >
      <div>
        <BaseItem className={`${prefixCls}-trigger`}>
          <div className={`${prefixCls}-content`}>
            <span className={`${prefixCls}-preview`}>{props.title || field.title}</span>
            {pattern === 'editable' && <EditOutlined className={`${prefixCls}-edit-btn`} />}
            {pattern !== 'editable' && <MessageOutlined className={`${prefixCls}-edit-btn`} />}
          </div>
        </BaseItem>
      </div>
    </AntdPopover>,
  );
});
export const Editable = Object.assign(InternalEditable, { Popover });

export default Editable;
