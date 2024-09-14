import React, { useEffect, useRef } from 'react';

export const Draggable = ({
  children,
  updateTransform = (transformStr, tx, ty, tdom) => {
    tdom.style.transform = transformStr;
  },
}) => {
  const ref = useRef<any>();
  const positionRef = useRef({
    startX: 0,
    startY: 0,
    dx: 0,
    dy: 0,
    tx: 0,
    ty: 0,
  });

  useEffect(() => {
    const node = ref.current;
    if (!node) {
      return;
    }
    const start = (event) => {
      if (event.button !== 0) {
        //只允许左键，右键问题在于不选择conextmenu就不会触发mouseup事件
        return;
      }
      document.addEventListener('mousemove', docMove);
      positionRef.current.startX = event.pageX - positionRef.current.dx;
      positionRef.current.startY = event.pageY - positionRef.current.dy;
    };
    const docMove = (event) => {
      const tx = event.pageX - positionRef.current.startX;
      const ty = event.pageY - positionRef.current.startY;
      const transformStr = `translate(${tx}px,${ty}px)`;
      updateTransform(transformStr, tx, ty, node);
      positionRef.current.dx = tx;
      positionRef.current.dy = ty;
    };
    const docMouseUp = (event) => {
      document.removeEventListener('mousemove', docMove);
    };

    node.addEventListener('mousedown', start);
    //用document移除对mousemove事件的监听
    document.addEventListener('mouseup', docMouseUp);
    return () => {
      node.removeEventListener('mousedown', start);
      document.removeEventListener('mouseup', docMouseUp);
    };
  }, [updateTransform]);

  const newStyle = { ...children.props.style, cursor: 'move', userSelect: 'none' };
  return React.cloneElement(React.Children.only(children), {
    ref,
    style: newStyle,
  });
};
