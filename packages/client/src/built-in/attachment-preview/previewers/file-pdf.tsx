import React, { useRef, useState } from 'react';

import { Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { Document, Page, pdfjs } from 'react-pdf';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

import { useStyles } from './file-pdf.style';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const options = {
  cMapUrl: `https://assets.tachybase.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
  cMapPacked: true,
  standardFontDataUrl: `https://assets.tachybase.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
};
pdfjs.GlobalWorkerOptions.workerSrc = `https://assets.tachybase.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const TransformInternal = ({ noTransformWrapper = false, children }) => {
  return noTransformWrapper ? (
    children
  ) : (
    <TransformWrapper minScale={1} maxScale={5} initialScale={1} limitToBounds={true} centerZoomedOut={true}>
      <TransformComponent>{children}</TransformComponent>
    </TransformWrapper>
  );
};

const CheckedComponent = (props) => {
  const { file, fileInfo, width, noTransformWrapper = false } = props;
  // NOTE: 有 url 就使用 url 形式, 没有就取 fileInfo, 默认为数据流
  const pdfInfo = file?.url || fileInfo;
  // @ts-ignore
  const { t } = useTranslation();
  const { styles } = useStyles();
  const containerRef = useRef(null);
  const [pdfWidth, setPdfWidth] = useState(600); // 默认宽度为 600px
  const [numPages, setNumPages] = useState(1);

  const onDocumentLoadSuccess = async (params) => {
    const { numPages, _transport } = params;
    // 根据显示容器的宽度, 动态适配 canvas 的宽高比;
    const containerWidth = containerRef?.current?.offsetWidth;
    const containerHeight = containerRef?.current?.offsetHeight;

    const page = await _transport.getPage(1);
    const originalViewport = page.getViewport({ scale: 1 });
    // const originalWidth = page.getViewport({ scale: 1 }).width;
    const originalHeight = originalViewport.height;
    const originalWidth = originalViewport.width;

    // const scale = containerWidth / originalWidth;

    // 判断 PDF 的宽度或高度是否超过某个阈值
    const isLargePdf = originalWidth > 800 || originalHeight > 1200;

    // 如果超出阈值，使用 1:1 缩放；否则，动态缩放适配容器
    const scale = isLargePdf
      ? 1 // 如果是大文件，使用 1:1 缩放
      : Math.min(containerWidth / originalWidth, containerHeight / originalHeight);

    const viewport = page.getViewport({ scale });
    setNumPages(numPages);
    setPdfWidth(viewport.width);
  };

  return (
    <Document
      className={styles.container}
      inputRef={containerRef}
      file={pdfInfo}
      options={options}
      onLoadError={(error) => {
        window?.Sentry?.captureException(error);
      }}
      noData={<div style={{ height: '100vh' }}></div>}
      error={<div>{t('Load PDF file error')}</div>}
      loading=""
      onLoadSuccess={onDocumentLoadSuccess}
    >
      <TransformInternal noTransformWrapper={noTransformWrapper}>
        <div>
          {Array.from(new Array(numPages), (el, index) => (
            <Page key={`page_${index + 1}`} pageNumber={index + 1} width={width || pdfWidth}>
              <div className={styles.footer}>
                <Tag className={styles.footerText} bordered={false}>
                  {index + 1}/{numPages}
                </Tag>
              </div>
            </Page>
          ))}
        </div>
      </TransformInternal>
    </Document>
  );
};

const ViewComponent = (props) => {
  const { file, prefixCls } = props;
  return (
    file.imageUrl && (
      <img
        src={`${file.imageUrl}${file.thumbnailRule || ''}`}
        style={{ width: '100%', height: '100%' }}
        alt={file.title}
        className={`${prefixCls}-list-item-image`}
      />
    )
  );
};

export const filePdf = {
  key: 'application/pdf',
  type: 'application/pdf',
  viewComponet: (props) => <ViewComponent {...props} />,
  checkedComponent: (props) => <CheckedComponent {...props} />,
};
