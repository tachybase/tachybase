import React from 'react';
import { ArrayField, ISchema, observer, ReactFC, RecursionField, useField, useFieldSchema } from '@tachybase/schema';

import cls from 'classnames';

import { SortableContainer, SortableElement, usePrefixCls } from '../__builtins__';
import { ArrayBase } from '../array-base';
import useStyle from './style';

const SortableItem = SortableElement((props) => {
  const prefixCls = usePrefixCls('formily-array-items');
  const [wrapSSR, hashId] = useStyle(prefixCls);

  return wrapSSR(
    <div {...props} className={cls(`${prefixCls}-item`, hashId, props.className)}>
      {props.children}
    </div>,
  );
});

const SortableList = SortableContainer((props) => {
  const prefixCls = usePrefixCls('formily-array-items');
  const [wrapSSR, hashId] = useStyle(prefixCls);
  return wrapSSR(
    <div {...props} className={cls(`${prefixCls}-list`, hashId, props.className)}>
      {props.children}
    </div>,
  );
});

const isAdditionComponent = (schema: ISchema) => {
  return schema['x-component']?.indexOf('Addition') > -1 || !!schema['x-component-props']?.['isAddition'];
};

const useAddition = () => {
  const schema = useFieldSchema();
  return schema.reduceProperties((addition, schema, key) => {
    if (isAdditionComponent(schema)) {
      return <RecursionField schema={schema} name={key} />;
    }
    return addition;
  }, null);
};

const InternalArrayItems: ReactFC<React.HTMLAttributes<HTMLDivElement>> = observer((props) => {
  const field = useField<ArrayField>();
  const prefixCls = usePrefixCls('formily-array-items');
  const [wrapSSR, hashId] = useStyle(prefixCls);
  const schema = useFieldSchema();
  const addition = useAddition();
  const dataSource = Array.isArray(field.value) ? field.value : [];
  if (!schema) throw new Error('can not found schema object');
  return wrapSSR(
    <ArrayBase>
      <div {...props} onChange={() => {}} className={cls(prefixCls, hashId, props.className)}>
        <SortableList
          list={dataSource.slice()}
          className={`${prefixCls}-sort-helper`}
          onSortEnd={(event) => {
            const { oldIndex, newIndex } = event;
            field.move(oldIndex, newIndex);
          }}
        >
          {dataSource?.map((item, index) => {
            const items = Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items;
            return (
              <ArrayBase.Item key={index} index={index} record={() => field.value?.[index]}>
                <SortableItem key={`item-${index}`} lockAxis="y" index={index}>
                  <div className={`${prefixCls}-item-inner`}>
                    {items ? <RecursionField schema={items} name={index} /> : null}
                  </div>
                </SortableItem>
              </ArrayBase.Item>
            );
          })}
        </SortableList>
        {addition}
      </div>
    </ArrayBase>,
  );
});

const Item: ReactFC<
  React.HTMLAttributes<HTMLDivElement> & {
    type?: 'card' | 'divide';
  }
> = (props) => {
  const prefixCls = usePrefixCls('formily-array-items');
  const [wrapSSR, hashId] = useStyle(prefixCls);
  return wrapSSR(
    <div
      {...props}
      onChange={() => {}}
      className={cls(`${prefixCls}-${props.type || 'card'}`, hashId, props.className)}
    >
      {props.children}
    </div>,
  );
};

export const ArrayItems = Object.assign(ArrayBase.mixin(InternalArrayItems), {
  Item,
});

ArrayItems.displayName = 'ArrayItems';

export default ArrayItems;
