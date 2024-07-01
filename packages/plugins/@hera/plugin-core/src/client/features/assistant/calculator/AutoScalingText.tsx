import React, { useEffect, useRef, useState } from 'react';

export const AutoScalingText = ({ children }) => {
  const ref = useRef<HTMLDivElement>();
  const [scale, setScale] = useState<number>(1);

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      const node = entries[0].target as HTMLDivElement;
      const parentNode = node.parentNode as HTMLDivElement;

      const availableWidth = parentNode.offsetWidth;
      const actualWidth = node.offsetWidth;
      const actualScale = availableWidth / actualWidth;

      setScale((scale) => {
        if (actualScale < 1) {
          return actualScale;
        } else if (scale < 1) {
          return 1;
        }
      });
    });
    const node = ref.current;
    observer.observe(node);
    return () => observer.unobserve(node);
  }, []);

  return (
    <div
      className="auto-scaling-text"
      style={{
        transition: 'transform 0.5s ease',
        transform: `scale(${scale},${scale})`,
      }}
      ref={ref}
    >
      {children}
    </div>
  );
};
