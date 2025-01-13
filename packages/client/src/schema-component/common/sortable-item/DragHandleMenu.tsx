import { useContext, useRef, useState } from 'react';

import { useDndContext, useDraggable } from '@dnd-kit/core';
import { cx } from 'antd-style';

import { useStyles } from './DragHandleMenu.style';
import { SortableContext } from './SortableItem';

export const DragHandleMenu = (props) => {
  const { children } = props;
  const { draggable } = useContext(SortableContext);
  const { attributes, listeners, setNodeRef, transform } = draggable;
  const { styles } = useStyles();

  const [isDraggable, setIsDraggable] = useState(false); // 是否可拖拽

  const pressTimer = useRef(null); // 用于存储定时器

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDraggable ? 999 : 'auto', // 拖拽时提高 z-index
      }
    : undefined;

  // 处理鼠标按下事件
  const handleMouseDown = (event) => {
    pressTimer.current = setTimeout(() => {
      setIsDraggable(true); // 达到时间阈值，立即启用拖拽
      console.log('%c Line:16 🚀 isDraggable', 'font-size:18px;color:#b03734;background:#465975', isDraggable);
      listeners.onStart(event); // 手动触发拖拽开始
    }, 500);
  };

  // 处理鼠标释放事件
  const handleMouseUp = () => {
    clearTimeout(pressTimer.current);
    setIsDraggable(false);
  };

  return (
    <div
      ref={setNodeRef}
      className={cx(styles.dragHandleMenu, {
        draggable: !!transform,
      })}
      style={style}
      {...(isDraggable ? listeners : {})} // 只有可拖拽时绑定拖拽事件
      {...attributes}
      role="none"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  );
};
