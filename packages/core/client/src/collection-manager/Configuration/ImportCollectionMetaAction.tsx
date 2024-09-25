import React, { useImperativeHandle, useState } from 'react';
import { useField, useForm } from '@tachybase/schema';

import { InboxOutlined } from '@ant-design/icons';
import { Button, message, Modal, Spin, Upload, UploadProps } from 'antd';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useAPIClient } from '../../api-client';
import { useRecord } from '../../record-provider';
import { useActionContext } from '../../schema-component';
import { useCollectionManager_deprecated } from '../hooks';
import { useResourceActionContext, useResourceContext } from '../ResourceActionProvider';

const { Dragger } = Upload;

function useUploadProps(props: UploadProps): any {
  const onChange = (param) => {
    props.onChange?.(param);
  };

  const api = useAPIClient();

  return {
    ...props,
    customRequest({ action, data, file, filename, headers, onError, onProgress, onSuccess, withCredentials }) {
      const formData = new FormData();
      if (data) {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
      }
      formData.append(filename, file);
      // eslint-disable-next-line promise/catch-or-return
      api.axios
        .post(action, formData, {
          withCredentials,
          headers,
          onUploadProgress: ({ total, loaded }) => {
            onProgress({ percent: Math.round((loaded / total) * 100).toFixed(2) }, file);
          },
        })
        .then(({ data }) => {
          onSuccess(data, file);
        })
        .catch(onError)
        .finally(() => {});

      return {
        abort() {
          console.log('upload progress is aborted.');
        },
      };
    },
    onChange,
  };
}

const ImportUpload = (props: any) => {
  const { t } = useTranslation();
  const { refreshCM } = useCollectionManager_deprecated();
  const { close } = props;
  const { refresh } = useResourceActionContext();

  const uploadProps: UploadProps = {
    multiple: false,
    action: '/collections:importMeta',
    async onChange(info) {
      if (info.fileList.length > 1) {
        info.fileList.splice(0, info.fileList.length - 1); // 只保留一个文件
      }
      const { status } = info.file;
      if (status === 'done') {
        close();
        message.success(`${info.file.name} ` + t('file uploaded successfully'));
        refresh();
        await refreshCM();
        window.location.reload();
      } else if (status === 'error') {
        message.error(`${info.file.name} ` + t('file upload failed'));
        window.location.reload();
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <Dragger {...useUploadProps(uploadProps)}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text"> {t('Click or drag file to this area to upload')}</p>
    </Dragger>
  );
};

const useCreateCollection = (schema?: any) => {
  const form = useForm();
  const { refreshCM } = useCollectionManager_deprecated();
  const ctx = useActionContext();
  const { refresh } = useResourceActionContext();
  const { resource } = useResourceContext();
  const field = useField();
  return {
    async run() {
      field.data = field.data || {};
      field.data.loading = true;
      try {
        await form.submit();
        const values = cloneDeep(form.values);
        if (schema?.events?.beforeSubmit) {
          schema.events.beforeSubmit(values);
        }
        if (!values.autoCreateReverseField) {
          delete values.reverseField;
        }
        delete values.autoCreateReverseField;
        await resource.create({
          values: {
            logging: true,
            ...values,
          },
        });
        ctx.setVisible(false);
        await form.reset();
        field.data.loading = false;
        refresh();
        await refreshCM();
      } catch (error) {
        field.data.loading = false;
      }
    },
  };
};

export const ImportCollectionMetaAction = React.forwardRef((props, ref) => {
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
      <Modal
        title={t('Import')}
        width={800}
        footer={undefined}
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
      >
        <Spin spinning={loading}>
          <ImportUpload close={handleCancel} />
        </Spin>
      </Modal>
    </>
  );
});
