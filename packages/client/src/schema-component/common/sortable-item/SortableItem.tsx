import React, { createContext, forwardRef, HTMLAttributes, useContext, useMemo } from 'react';
import { observer, Schema, useField, useFieldSchema } from '@tachybase/schema';

import { TinyColor } from '@ctrl/tinycolor';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useMergeRefs } from '@floating-ui/react';
import cx from 'classnames';

import { useToken } from '../../antd/__builtins__';

export const DraggableContext = createContext(null);
DraggableContext.displayName = 'DraggableContext';
export const SortableContext = createContext(null);
SortableContext.displayName = 'SortableContext';

export const SortableProvider = (props) => {
  const { id, data, children } = props;
  const draggable = useDraggable({
    id,
    data,
  });
  const droppable = useDroppable({
    id,
    data,
  });
  return <SortableContext.Provider value={{ draggable, droppable }}>{children}</SortableContext.Provider>;
};

export const Sortable = forwardRef((props: any, ref) => {
  const { component, overStyle, style, children, openMode, ...others } = props;
  const { token } = useToken();
  const { draggable, droppable } = useContext(SortableContext);
  const { isOver, setNodeRef } = droppable;
  const mergedRef = useMergeRefs([setNodeRef, ref]);
  const droppableStyle = { ...style };

  if (isOver && draggable?.active?.id !== droppable?.over?.id) {
    droppableStyle[component === 'a' ? 'color' : 'background'] = new TinyColor(token.colorSettings)
      .setAlpha(0.15)
      .toHex8String();
    Object.assign(droppableStyle, overStyle);
  }

  return React.createElement(
    component || 'div',
    {
      role: 'none',
      ...others,
      className: cx('tb-sortable-designer', props.className),
      ref: mergedRef,
      style: droppableStyle,
    },
    children,
  );
});

const useSortableItemProps = (props) => {
  const id = useSortableItemId(props);
  const schema = useFieldSchema();
  if (props.schema) {
    return { ...props, id };
  }
  return { ...props, id, schema };
};

const useSortableItemId = (props) => {
  const field = useField();
  if (props.id) {
    return props.id;
  }
  return field.address.toString();
};

interface SortableItemProps extends HTMLAttributes<HTMLDivElement> {
  eid?: string;
  schema?: Schema;
  removeParentsIfNoChildren?: boolean;
  ref?: React.Ref<any>;
  overStyle?: object;
}

export const SortableItem = observer(
  (props: SortableItemProps) => {
    const { schema, id, eid, removeParentsIfNoChildren, ...others } = useSortableItemProps(props);

    const data = useMemo(() => {
      return {
        insertAdjacent: 'afterEnd',
        schema: schema,
        removeParentsIfNoChildren: removeParentsIfNoChildren ?? true,
      };
    }, [schema, removeParentsIfNoChildren]);

    return (
      <SortableProvider id={id} data={data}>
        <Sortable id={eid} {...others} ref={props.ref}>
          {props.children}
        </Sortable>
      </SortableProvider>
    );
  },
  { displayName: 'SortableItem', forwardRef: true },
);

export const DragHandler = (props) => {
  const { draggable } = useContext(SortableContext);
  const { attributes, listeners, setNodeRef } = draggable;

  return (
    <div
      style={{
        display: 'inline-block',
        width: 14,
        height: 14,
        lineHeight: '14px',
        textAlign: 'left',
      }}
    >
      <div
        ref={setNodeRef}
        style={{
          // ...style,
          position: 'relative',
          zIndex: 1,
          // backgroundColor: '#333',
          lineHeight: 0,
          fontSize: 0,
          display: 'inline-block',
        }}
        {...listeners}
        {...attributes}
        role="none"
      >
        <span style={{ cursor: 'move', fontSize: 14 }}>{props.children}</span>
      </div>
    </div>
  );
};
