import React, { useEffect, useRef, useState } from 'react';
import { Lightbox } from '@tachybase/components';
import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { DeleteOutlined, DownloadOutlined, InboxOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Upload as AntdUpload, Button, Modal, Progress, Space, UploadFile } from 'antd';
import cls from 'classnames';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

import { useApp } from '../../../application';
import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { useProps } from '../../hooks/useProps';
import { ReadPretty } from './ReadPretty';
import { isImage, isPdf, toArr, toFileList, toItem, toValue, useUploadProps } from './shared';
import { useStyles } from './style';
import type { ComposedUpload, DraggerProps, DraggerV2Props, UploadProps } from './type';

export const Upload: ComposedUpload = connect(
  (props: UploadProps) => {
    return <AntdUpload {...useUploadProps(props)} />;
  },
  mapProps({
    value: 'fileList',
  }),
  mapReadPretty(ReadPretty.Upload),
);

Upload.Attachment = connect((props: UploadProps) => {
  const { disabled, multiple, value, onChange } = props;
  const [fileList, setFileList] = useState<any[]>([]);
  const [sync, setSync] = useState(true);
  const app = useApp();
  const previewList = app.AttachmentPreviewManager.get();
  const images = fileList;
  const [fileIndex, setFileIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation();
  const uploadProps = useUploadProps({ ...props });
  const { wrapSSR, hashId, componentCls: prefixCls } = useStyles();
  const internalFileList = useRef([]);
  useEffect(() => {
    if (sync) {
      const fileList = toFileList(value);
      setFileList(fileList);
      internalFileList.current = fileList;
    }
  }, [value, sync]);

  return wrapSSR(
    <div>
      <div className={cls(`${prefixCls}-wrapper`, `${prefixCls}-picture-card-wrapper`, 'tb-upload', hashId)}>
        <div className={cls(`${prefixCls}-list`, `${prefixCls}-list-picture-card`)}>
          {fileList.map((file, index) => {
            const fileProps = {
              file,
              prefixCls,
              fileList,
              setFileIndex,
              setVisible,
              disabled,
              t,
              setSync,
              setFileList,
              multiple,
              onChange,
              internalFileList,
              preview: previewList[file?.mimetype] || previewList['default'],
            };
            return <UploadReadFile {...fileProps} key={index} />;
          })}
          {!disabled && (multiple || toArr(value).length < 1) && (
            <div className={cls(`${prefixCls}-list-picture-card-container`, `${prefixCls}-list-item-container`)}>
              <AntdUpload
                {...uploadProps}
                disabled={disabled}
                multiple={multiple}
                listType={'picture-card'}
                fileList={fileList}
                onChange={(info) => {
                  // info.fileList 有 BUG，会导致上传状态一直是 uploading
                  // 所以这里仿照 antd 源码，自己维护一个 fileList
                  const list = updateFileList(info.file, internalFileList.current);
                  internalFileList.current = list;

                  setSync(false);
                  if (multiple) {
                    if (info.file.status === 'done') {
                      onChange?.(toValue(list));
                    }
                    onChange?.(toValue(list));
                    setFileList(list.map(toItem));
                    setSync(true);
                  } else {
                    if (info.file.status === 'done') {
                      // TODO(BUG): object 的联动有问题，不响应，折中的办法先置空再赋值
                      onChange?.(null as any);
                      onChange?.(info.file?.response?.data);
                    }
                    setFileList([toItem(info.file)]);
                    setSync(true);
                  }
                }}
                showUploadList={false}
              >
                {!disabled && (multiple || toArr(value).length < 1) && (
                  <span>
                    <PlusOutlined />
                    <br /> {t('Upload')}
                  </span>
                )}
              </AntdUpload>
            </div>
          )}
        </div>
      </div>
      {/* 预览图片的弹框 */}
      {visible && (
        <Lightbox
          // discourageDownloads={true}
          mainSrc={images[fileIndex]?.imageUrl}
          nextSrc={images[(fileIndex + 1) % images.length]?.imageUrl}
          prevSrc={images[(fileIndex + images.length - 1) % images.length]?.imageUrl}
          mainFile={images[fileIndex]}
          nextFile={images[(fileIndex + 1) % images.length]}
          prevFile={images[(fileIndex + images.length - 1) % images.length]}
          previewList={previewList}
          onCloseRequest={() => setVisible(false)}
          onMovePrevRequest={() => setFileIndex((fileIndex + images.length - 1) % images.length)}
          onMoveNextRequest={() => setFileIndex((fileIndex + 1) % images.length)}
          imageTitle={images[fileIndex]?.title}
          toolbarButtons={[
            <button
              key={'preview-img'}
              style={{ fontSize: 22, background: 'none', lineHeight: 1 }}
              type="button"
              aria-label="Zoom in"
              title="Zoom in"
              className="ril-zoom-in ril__toolbarItemChild ril__builtinButton"
              onClick={(e) => {
                e.preventDefault();
                const file = images[fileIndex];
                saveAs(file.url, `${file.title}${file.extname}`);
              }}
            >
              <DownloadOutlined />
            </button>,
          ]}
        />
      )}
    </div>,
  );
}, mapReadPretty(ReadPretty.File));

Upload.Dragger = connect(
  (props: DraggerProps) => {
    const { tipContent } = props;
    const { wrapSSR, hashId, componentCls: prefixCls } = useStyles();
    return wrapSSR(
      <div className={cls(`${prefixCls}-dragger`, hashId)}>
        <AntdUpload.Dragger {...useUploadProps(props)}>
          {tipContent}
          {props.children}
        </AntdUpload.Dragger>
      </div>,
    );
  },
  mapProps({
    value: 'fileList',
  }),
);

Upload.DraggerV2 = withDynamicSchemaProps(
  connect(
    (props: DraggerV2Props) => {
      const { t } = useTranslation();
      const defaultTitle = t('Click or drag file to this area to upload');
      const defaultSubTitle = t('Support for a single or bulk upload, file size should not exceed') + ` 10MB`;
      const { title = defaultTitle, subTitle = defaultSubTitle, ...extraProps } = useProps(props);
      const [loading, setLoading] = useState(false);
      const { wrapSSR, hashId, componentCls: prefixCls } = useStyles();

      const handleChange = (fileList: any[] = []) => {
        const { onChange } = extraProps;
        onChange?.(fileList);

        if (fileList.some((file) => file.status === 'uploading')) {
          setLoading(true);
        } else {
          setLoading(false);
        }
      };

      return wrapSSR(
        <div className={cls(`${prefixCls}-dragger`, hashId)}>
          {/* @ts-ignore */}
          <AntdUpload.Dragger {...useUploadProps({ ...props, ...extraProps, onChange: handleChange })}>
            <p className={`${prefixCls}-drag-icon`}>
              {loading ? <LoadingOutlined style={{ fontSize: 36 }} spin /> : <InboxOutlined />}
            </p>
            <p className={`${prefixCls}-text`}>{title}</p>
            <p className={`${prefixCls}-hint`}>{subTitle}</p>
          </AntdUpload.Dragger>
        </div>,
      );
    },
    mapProps({
      value: 'fileList',
    }),
  ),
  { displayName: 'Upload.DraggerV2' },
);

export default Upload;

function updateFileList(file: UploadFile, fileList: (UploadFile | Readonly<UploadFile>)[]) {
  const nextFileList = [...fileList];
  const fileIndex = nextFileList.findIndex(({ uid }) => uid === file.uid);
  if (fileIndex === -1) {
    nextFileList.push(file);
  } else {
    nextFileList[fileIndex] = file;
  }
  return nextFileList;
}

export const UploadReadFile = (props) => {
  const {
    file,
    prefixCls,
    fileList,
    setFileIndex,
    setVisible,
    disabled,
    t,
    setSync,
    setFileList,
    multiple,
    onChange,
    internalFileList,
    preview,
  } = props;
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const index = fileList.indexOf(file);
    setVisible(true);
    setFileIndex(index);
  };
  const { viewComponet } = preview;
  return (
    <div
      key={file.uid || file.id}
      className={`${prefixCls}-list-picture-card-container ${prefixCls}-list-item-container`}
    >
      <div
        className={cls(
          `${prefixCls}-list-item`,
          `${prefixCls}-list-item-done`,
          `${prefixCls}-list-item-list-type-picture-card`,
        )}
      >
        <div className={`${prefixCls}-list-item-info`}>
          <span className={`${prefixCls}-span`}>
            <a
              className={`${prefixCls}-list-item-thumbnail`}
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleClick}
              style={{ lineHeight: '100%' }}
            >
              {viewComponet({ prefixCls, file, setFileIndex, setVisible })}
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              className={`${prefixCls}-list-item-name`}
              title={file.title}
              href={file.url}
              onClick={handleClick}
            >
              {file.status === 'uploading' ? t('Uploading') : file.title}
            </a>
          </span>
        </div>
        <span className={`${prefixCls}-list-item-actions`}>
          <Space size={3}>
            <Button
              size={'small'}
              type={'text'}
              icon={<DownloadOutlined />}
              onClick={() => {
                saveAs(file.url, `${file.title}${file.extname}`);
              }}
            />
            {!disabled && (
              <Button
                size={'small'}
                type={'text'}
                icon={<DeleteOutlined />}
                onClick={() => {
                  setSync(false);
                  setFileList((prevFileList) => {
                    if (!multiple) {
                      onChange?.(null as any);
                      setSync(true);
                      return [];
                    }
                    const index = prevFileList.indexOf(file);
                    prevFileList.splice(index, 1);
                    internalFileList.current = internalFileList.current.filter((item) => item.uid !== file.uid);
                    onChange?.(toValue([...prevFileList]));
                    return [...prevFileList];
                  });
                }}
              />
            )}
          </Space>
        </span>
        {file.status === 'uploading' && (
          <div className={`${prefixCls}-list-item-progress`}>
            <Progress strokeWidth={2} type={'line'} showInfo={false} percent={file.percent} />
          </div>
        )}
      </div>
    </div>
  );
};
