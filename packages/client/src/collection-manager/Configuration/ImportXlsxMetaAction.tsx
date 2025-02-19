import React, { useImperativeHandle, useMemo, useState } from 'react';
import {
  SchemaComponent,
  useAPIClient,
  useCollectionManager_deprecated,
  useResourceActionContext,
} from '@tachybase/client';

import { InboxOutlined } from '@ant-design/icons';
import { App, Button, Drawer, message, Modal, Spin, Upload, UploadFile, UploadProps } from 'antd';
import { useTranslation } from 'react-i18next';

import { createXlsxCollectionSchema } from './XlsxCollectionSchema';

const { Dragger } = Upload;

// function useUploadProps(props: UploadProps): any {
//   const onChange = (param) => {
//     props.onChange?.(param);
//   };
//   const api = useAPIClient();

//   return {
//     ...props,
//     customRequest({ action, data, file, filename, headers, onError, onProgress, onSuccess, withCredentials }) {
//       const formData = new FormData();
//       if (data) {
//         Object.keys(data).forEach((key) => {
//           formData.append(key, data[key]);
//         });
//       }
//       formData.append(filename, file);
//       // eslint-disable-next-line promise/catch-or-return
//       api.axios
//         .post(action, formData, {
//           withCredentials,
//           headers,
//           onUploadProgress: ({ total, loaded }) => {
//             onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
//           },
//         })
//         .then(({ data }) => {
//           onSuccess(data, file);
//         })
//         .catch(onError)
//         .finally(() => { });

//       return {
//         abort() {
//           console.log('upload progress is aborted.');
//         },
//       };
//     },

//     onChange,
//   };
// }

const ImportUpload = (props: any) => {
  const { t } = useTranslation();
  const { refreshCM } = useCollectionManager_deprecated();
  const { close } = props;
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [collectionDrawer, setCollectionDrawer] = useState(false);
  const {
    refresh,
    state: { category },
  } = useResourceActionContext();

  const showCollectionDrawer = () => {
    setCollectionDrawer(true);
  };

  const onCollectionDrawerClose = () => {
    setCollectionDrawer(false);
  };

  const importProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };
  const xlsxCollectionSchema = useMemo(() => createXlsxCollectionSchema(fileList), [fileList]);
  console.log('%c Line:85 🍷 fileList', 'color:#f5ce50', fileList);

  return (
    <>
      <Dragger maxCount={1} {...importProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text"> {t('Click or drag file to this area to upload')}</p>
      </Dragger>
      <Button type="primary" onClick={showCollectionDrawer} disabled={fileList.length === 0} style={{ marginTop: 16 }}>
        Import
      </Button>
      <Drawer title="创建数据表" closable={false} onClose={onCollectionDrawerClose} open={collectionDrawer}>
        <SchemaComponent schema={xlsxCollectionSchema} />
      </Drawer>
    </>
  );
};

export const ImportXlsxMetaAction = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [dataTypes, setDataTypes] = useState<any[]>(['required']);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  useImperativeHandle(ref, () => ({
    showModal,
  }));

  const handleCancel = () => {
    setIsModalOpen(false);
    setDataTypes(['required']);
  };
  return (
    <>
      <Drawer title={t('Import xlsx')} footer={undefined} open={isModalOpen} onClose={handleCancel}>
        <Spin spinning={loading}>
          <ImportUpload close={handleCancel} />
        </Spin>
      </Drawer>
    </>
  );
});
