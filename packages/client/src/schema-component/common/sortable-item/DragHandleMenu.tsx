import { useCallback, useContext, useEffect, useRef, useState } from 'react';

import { cx } from 'antd-style';
import { MenuContext } from 'rc-menu/es/context/MenuContext';

import { useDesignable } from '../../hooks';
import { useStyles } from './DragHandleMenu.style';
import { SortableContext } from './SortableItem';

const AutoCloseMenu = ({ children }) => {
  return children;
};

// export const DragHandleMenu = (props) => {
//   // const { onOpenChange } = useContext(MenuContext);
//   // const { draggable } = useContext(SortableContext);
//   // const { designable } = useDesignable();
//   // const { isDragging } = draggable;

//   // useEffect(() => {
//   //   if (!designable && props.isSubMenu && isDragging) {
//   //     // 拖动分组时, 自动关闭当前分组
//   //     onOpenChange?.(props.name, false);
//   //     // setStateOpenKeys?.((prevOpenKeys) => {
//   //     //   return prevOpenKeys.filter((key) => key !== name);
//   //     // });
//   //   }
//   // }, [designable, isDragging, props.isSubMenu, props.name]);

//   return <AutoCloseMenu><DragHandleMenuImpl {...props} /></AutoCloseMenu>
// }

export const DragHandleMenu = (props) => {
  const { isSubMenu, name, children } = props;
  const { draggable } = useContext(SortableContext);
  const { onOpenChange } = useContext(MenuContext);
  const { designable } = useDesignable();
  const { attributes, listeners, setNodeRef, transform, isDragging } = draggable;
  const { styles } = useStyles();
  const ref = useRef(null); // 用于获取元素的宽高
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 }); // 存储元素的宽高
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 }); // 存储指针的初始位置

  // 计算偏移量
  const centerOffset = {
    x: dimensions.width / 4,
    y: dimensions.height / 4,
  };

  const style = {
    position: isDragging ? 'fixed' : 'relative', // 拖拽时脱离文档流
    top: isDragging ? initialPosition.y - centerOffset.y : 0, // 初始位置减去偏移量
    left: isDragging ? initialPosition.x - centerOffset.x : 0, // 初始位置减去偏移量
    width: isDragging ? dimensions.width : '100%', // 保持宽高不变
    height: isDragging ? dimensions.height : '100%', // 保持宽高不变
    zIndex: isDragging ? 999 : 'auto', // 拖拽时提高层级
    pointerEvents: isDragging ? 'none' : 'auto', // 拖拽时禁用指针事件

    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${isDragging ? 1.05 : 1})` // 拖拽时放大 1.1 倍
      : undefined,
    boxShadow: isDragging ? '0 4px 8px rgba(0, 0, 0, 0.1)' : 'none',
  };

  // 处理鼠标按下事件
  const handleMouseDown = (event) => {
    if (ref.current) {
      // 在拖拽开始前获取元素的宽高
      const { width, height } = ref.current.getBoundingClientRect();
      // 获取指针的初始位置
      const { clientX, clientY } = event;

      setDimensions({ width, height });
      setInitialPosition({ x: clientX, y: clientY });
    }
  };

  useEffect(() => {
    if (isSubMenu && isDragging) {
      // 拖动分组时, 自动关闭当前分组
      onOpenChange?.(name, false);
    }
  }, [isDragging]);

  if (!designable) {
    return children;
  }

  return (
    <div
      ref={setNodeRef}
      className={cx(styles.dragHandleMenu, {
        draggable: isDragging,
        leftBorder: isDragging && isSubMenu,
      })}
      style={style}
      {...listeners}
      {...attributes}
      role="none"
      onMouseDown={handleMouseDown}
    >
      <div ref={ref} className={'wrapper'}>
        {children}
      </div>
    </div>
  );
};
