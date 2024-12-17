import React, { useEffect, useRef, useState } from 'react';

import { Input } from 'antd';

export const AutoResizeInput = ({ ...props }) => {
  const [inputWidth, setInputWidth] = useState(30); // 初始宽度
  const spanRef = useRef(null);

  const handleInputChange = (e) => {
    // TODO fix width offset
    setInputWidth(spanRef.current.offsetWidth + 50); // 更新宽度
    props.onChange?.(e);
  };

  useEffect(() => {
    setInputWidth(spanRef.current.offsetWidth + 50); // 初始宽度
  }, []);

  return (
    <div style={{ display: 'inline-block', position: 'relative', height: '100%' }}>
      <Input
        {...props}
        onChange={handleInputChange}
        style={{
          width: `${inputWidth}px`,
        }}
      />
      <span
        ref={spanRef}
        style={{
          position: 'absolute',
          visibility: 'hidden',
          whiteSpace: 'pre',
          font: 'inherit',
        }}
      >
        {props.value || props.placeholder}
      </span>
    </div>
  );
};
