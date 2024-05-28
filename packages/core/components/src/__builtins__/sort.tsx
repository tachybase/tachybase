import React, { createContext, useContext, useMemo } from 'react';

import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ReactFC } from '@formily/reactive-react';

export type { Transform } from '@dnd-kit/utilities';

export interface ISortableContainerProps {
  list: any[];
  start?: number;
  accessibility?: {
    container?: Element;
  };
  onSortStart?: (event: DragStartEvent) => void;
  onSortEnd?: (event: { oldIndex: number; newIndex: number }) => void;
}

export function SortableContainer<T extends React.HTMLAttributes<HTMLElement>>(
  Component: ReactFC<T>,
): ReactFC<ISortableContainerProps & T> {
  return ({ list, start = 0, accessibility, onSortStart, onSortEnd, ...props }) => {
    const _onSortEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over) return;
      const oldIndex = +active.id - 1;
      const newIndex = +over.id - 1;
      onSortEnd?.({
        oldIndex,
        newIndex,
      });
    };

    return (
      <DndContext accessibility={accessibility} onDragStart={onSortStart} onDragEnd={_onSortEnd}>
        <SortableContext items={list.map((_, index) => index + start + 1)} strategy={verticalListSortingStrategy}>
          <Component {...(props as unknown as T)}>{props.children}</Component>
        </SortableContext>
      </DndContext>
    );
  };
}

export const useSortableItem = () => {
  return useContext(SortableItemContext);
};

export const SortableItemContext = createContext<Partial<ReturnType<typeof useSortable>>>({});

export interface ISortableElementProps {
  index?: number;
  lockAxis?: 'x' | 'y';
}

export function SortableElement<T extends React.HTMLAttributes<HTMLElement>>(
  Component: ReactFC<T>,
): ReactFC<T & ISortableElementProps> {
  return ({ index = 0, lockAxis, ...props }) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const sortable = useSortable({
      id: index + 1,
    });
    const { setNodeRef, transform, transition, isDragging } = sortable;
    if (transform) {
      switch (lockAxis) {
        case 'x':
          transform.y = 0;
          break;
        case 'y':
          transform.x = 0;
          break;

        default:
          break;
      }
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const style = useMemo(() => {
      const zIndex = transform ? 1 : 'none';
      const position = transform ? 'relative' : 'unset';
      const itemStyle: React.CSSProperties = {
        position,
        touchAction: 'none',
        zIndex,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
        transition: `${transform ? 'all 200ms ease' : ''}`,
      };
      const dragStyle = {
        transition,
        opacity: '0.8',
        transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
      };

      const computedStyle = isDragging
        ? {
            ...itemStyle,
            ...dragStyle,
            ...props.style,
          }
        : {
            ...itemStyle,
            ...props.style,
          };

      return computedStyle;
    }, [isDragging, transform, transition, props.style]);

    return (
      <SortableItemContext.Provider value={sortable}>
        {Component({
          ...props,
          style,
          ref: setNodeRef,
        } as unknown as T)}
      </SortableItemContext.Provider>
    );
  };
}

export function SortableHandle<T extends React.HTMLAttributes<HTMLElement>>(Component: ReactFC<T>): ReactFC<T> {
  return (props: T) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { attributes, listeners } = useSortableItem();
    return <Component {...props} {...attributes} {...listeners} />;
  };
}
