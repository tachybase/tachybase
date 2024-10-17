import React, { useEffect, useRef, useState } from 'react';
import { css, useApp } from '@tachybase/client';

import { Space } from 'antd';
import { debounce } from 'lodash';

import { PDFViewer } from '../../components/PDFViewer';
import { usePDFViewerRef } from './PDFVIewerBlockInitializer';

export const InternalPDFViewer = (props) => {
  const { usePdfPath: useMaybePdfPath } = props;
  const containerRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [, setHeight] = useState(0);
  useEffect(() => {
    const updateUI = debounce(() => {
      if (containerRef.current) {
        setWidth(containerRef.current.offsetWidth);
        setHeight(containerRef.current.offsetHeight);
      }
    }, 200);
    const observer = new ResizeObserver(() => {
      updateUI();
    });
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => {
      observer.disconnect();
    };
  }, [containerRef]);
  const ref = usePDFViewerRef();
  const usePdfPath = useMaybePdfPath ?? (() => '');
  const pdfPath = usePdfPath();
  return (
    <div>
      <div
        className={css`
          display: flex;
        `}
      >
        <div
          className={css`
            flex: 1;
          `}
        ></div>
        <Space></Space>
      </div>
      <div
        ref={containerRef}
        className={css`
          border: 1px dashed black;
          margin-top: 12px;
          overflow: hidden;
          display: flex;
          justify-content: center;

          div::-webkit-scrollbar {
            display: none;
          }
        `}
      >
        {pdfPath ? <PDFViewer file={pdfPath} width={width} ref={ref} /> : ''}
      </div>
    </div>
  );
};
