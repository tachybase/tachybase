import { useState, useRef, useEffect } from 'react';
import { useFormLayout } from '../../form-layout';

export function useOverflow<Container extends HTMLElement, Content extends HTMLElement>() {
  const [overflow, setOverflow] = useState(false);
  const containerRef = useRef<Container>(null);
  const contentRef = useRef<Content>(null);
  const layout = useFormLayout();
  const labelCol = JSON.stringify(layout.labelCol);

  useEffect(() => {
    requestAnimationFrame(() => {
      if (containerRef.current && contentRef.current) {
        const contentWidth = contentRef.current.getBoundingClientRect().width;
        const containerWidth = containerRef.current.getBoundingClientRect().width;
        if (contentWidth && containerWidth && containerWidth < contentWidth) {
          if (!overflow) setOverflow(true);
        } else {
          if (overflow) setOverflow(false);
        }
      }
    });
  }, [labelCol]);

  return {
    overflow,
    containerRef,
    contentRef,
  };
}
