import React, { useImperativeHandle, useMemo, useState } from 'react';
import {
  ActionContextProvider,
  RecordProvider,
  SchemaComponent,
  useAPIClient,
  useCollectionManager_deprecated,
  useCollectionParentRecordData,
  useResourceActionContext,
} from '@tachybase/client';
import { uid } from '@tachybase/schema';

import { InboxOutlined } from '@ant-design/icons';
import { App, Button, Drawer, message, Modal, Spin, Upload, UploadFile, UploadProps } from 'antd';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import { createXlsxCollectionSchema, FieldsConfigure, FormValueContext } from './XlsxCollectionSchema';

const { Dragger } = Upload;

const ImportUpload = (props: any) => {
  const { t } = useTranslation();
  const { refreshCM } = useCollectionManager_deprecated();
  const { close } = props;
  const [fileList, setFile] = useState<UploadFile[]>([]);
  const [filedata, setFileData] = useState({});
  const [collectionDrawer, setCollectionDrawer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [schema, setSchema] = useState({});
  // const parentRecordData = useCollectionParentRecordData();
  // const [formValue, setFormValue] = useState(null);
  // const {
  //   refresh,
  //   state: { category },
  // } = useResourceActionContext();

  const showCollectionDrawer = () => {
    setCollectionDrawer(true);
    close();
  };

  const onCollectionDrawerClose = () => {
    setCollectionDrawer(false);
  };

  // 判断函数，根据字段值的类型给出类型字符串
  const inferType = (values, header) => {
    if (header.toLowerCase().includes('id')) {
      return 'string';
    }
    // if (
    //   header.toLowerCase().includes('date') ||
    //   header.toLowerCase().includes('时间') ||
    //   header.toLowerCase().includes('日期')
    // ) {
    //   return 'date';
    // }
    const types = values.map((value) => {
      // if (typeof value === 'boolean') {
      //   return 'boolean';
      // }
      if (typeof value === 'number') {
        if (Number.isInteger(value)) {
          return 'integer';
        }
        return 'number';
      }
      if (typeof value === 'string') {
        try {
          // 判断是否为有效的 JSON 字符串
          JSON.parse(value);
          return 'json'; // 如果能解析为 JSON，返回 json
        } catch {
          return 'string'; // 否则认为是字符串
        }
      }
      return 'string'; // 默认返回字符串
    });
    // 如果所有类型一致，则返回第一个类型，否则返回 null
    const uniqueTypes = [...new Set(types)];
    if (uniqueTypes.length === 1) {
      return uniqueTypes[0];
    }
    return 'string';
  };

  // 判断接口类型，选择适合的界面控件
  const inferInterface = (type, header) => {
    if (header.toLowerCase().includes('id')) {
      return 'id';
    }
    switch (type) {
      case 'json':
        return 'json';
      case 'boolean':
        return 'checkbox';
      case 'string':
        return 'input';
      case 'integer':
        return 'integer';
      case 'float':
        return 'float';
      case 'date':
        return 'datetime';
      default:
        return null; // 返回 null，因为该列的数据类型不一致
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    // 当文件读取完成后
    reader.onload = (e) => {
      const binaryStr = e.target.result; // 获取文件内容
      const workbook = XLSX.read(binaryStr, { type: 'binary' }); // 解析工作簿

      // 获取第一个工作表
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // 转换为 JSON 格式
      const jsonData: Array<any[]> = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (jsonData.length === 0) return;
      const headers = jsonData[0];
      const rows = jsonData.slice(1);

      // 构建 fields 数组
      const fields = headers.map((header, index) => {
        const columnValues = rows.map((row) => row[index]); // 获取该列所有的值
        const type = inferType(columnValues, header); // 获取该列类型
        const interfaceType = type ? inferInterface(type, header) : null;
        const fieldsName = `f_${uid()}`;

        return {
          // title: header,
          name: fieldsName,
          type: type, // 如果类型不一致则为 null
          interface: interfaceType,
          uiSchema: {
            title: header,
          },
        };
      });

      // 格式化数据部分（保持原样）
      const data = rows.map((row) => {
        return headers.reduce((acc, header, index) => {
          const value = row[index];
          const fieldsName = fields[index].name;
          acc[fieldsName] = value; // 保持原值
          return acc;
        }, {});
      });

      const fileData = {
        fields: fields, // fields 数组
        data: data, // 数据
      };
      // 设置文件数据
      setFileData(fileData);
    };
    reader.readAsBinaryString(file);
  };

  const importProps: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFile(newFileList);
    },
    beforeUpload: (file) => {
      handleFileUpload(file);
      setFile([file]);
      return false;
    },
    fileList,
  };

  return (
    <>
      <Dragger maxCount={1} {...importProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text"> {t('Click or drag file to this area to upload')}</p>
      </Dragger>
      <ActionContextProvider value={{ visible, setVisible }}>
        <Button
          type="primary"
          onClick={async () => {
            const xlsxCollectionSchema = createXlsxCollectionSchema(fileList, filedata);
            setSchema(xlsxCollectionSchema);
            setVisible(true);
            close();
          }}
          disabled={fileList.length === 0}
          style={{ marginTop: 16 }}
        >
          Upload
        </Button>
        <SchemaComponent schema={schema} components={{ FieldsConfigure }} />
      </ActionContextProvider>
    </>
  );
};

export const ImportXlsxMetaAction = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  // const [dataTypes, setDataTypes] = useState<any[]>(['required']);
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
    // setDataTypes(['required']);
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
