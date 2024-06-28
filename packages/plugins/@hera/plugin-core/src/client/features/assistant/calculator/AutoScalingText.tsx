import React, { useEffect, useRef, useState } from 'react';

export const AutoScalingText = ({ children }) => {
  const ref = useRef<HTMLDivElement>();
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const node = ref.current;
    const parentNode = node.parentNode;

    // @ts-ignore
    const availableWidth = parentNode.offsetWidth;
    const actualWidth = node.offsetWidth;
    const actualScale = availableWidth / actualWidth;

    if (scale === actualScale) return;

    if (actualScale < 1) {
      setScale(actualScale);
    } else if (scale < 1) {
      setScale(1);
    }
  }, [scale]);

  return (
    <div className="auto-scaling-text" style={{ transform: `scale(${scale},${scale})` }} ref={ref}>
      {children}
    </div>
  );
};
