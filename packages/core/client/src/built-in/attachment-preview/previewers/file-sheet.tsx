import React, { useEffect, useRef, useState } from 'react';

import jsPreviewExcel from '@js-preview/excel';
import { Spin } from 'antd';

import '@js-preview/excel/lib/index.css';

import { useStyles } from './file-sheet.style';

// https://501351981.github.io/vue-office/examples/docs/guide/preview-xlsx.html
// 目前只支持xlsx文件预览，不支持xls文件。
const ExcelView = (props) => {
  const { file } = props;
  const fileUrl = file.url;
  const { styles } = useStyles();
  const excelContainerRef = useRef(null);
  const excelPreviewerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const containerElement = excelContainerRef.current;
    if (containerElement && !excelPreviewerRef.current) {
      const myExcelPreviewer = jsPreviewExcel.init(containerElement);
      excelPreviewerRef.current = myExcelPreviewer;

      setIsLoading(true);

      const handleShowPreviewer = async () => {
        await myExcelPreviewer.preview(fileUrl);
        setIsLoading(false);
      };

      try {
        handleShowPreviewer();
      } catch (e) {
        console.log('%c Line:36 🥟 e', e);
      }
    }
  }, [fileUrl]);

  return (
    <div className={styles.excelPreview}>
      <div ref={excelContainerRef} className={styles.container} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
          <Spin size="large" />
        </div>
      )}
    </div>
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

// @js-preview/excel 目前只支持xlsx文件预览，不支持xls文件. 使用 microsoft online office 预览.
export const fileXLS = {
  key: 'application/vnd.ms-excel',
  type: 'application/vnd.ms-excel',
  viewComponet: (props) => <ViewComponent {...props} />,
  checkedComponent: (props) => {
    const { file } = props;
    let fileUrl = file.url ?? '';
    // NOTE: 这里硬编码了, 但是考虑到存储在系统内部的, 固定格式必定以/storage开头, 这里可以这么写
    if (fileUrl.startsWith('/storage') && window.location.origin) {
      fileUrl = window.location.origin + fileUrl;
    }
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${fileUrl}`}
        width="100%"
        height="600px"
        frameBorder="0"
      />
    );
  },
};

export const fileXLSX = {
  key: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  viewComponet: (props) => <ViewComponent {...props} />,
  checkedComponent: (props) => <ExcelView {...props} />,
};

export const fileCSV = {
  key: 'text/csv',
  type: 'text/csv',
  viewComponet: (props) => <ViewComponent {...props} />,
  checkedComponent: (props) => <ExcelView {...props} />,
};
