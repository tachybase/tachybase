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

  // const showCollectionDrawer = () => {
  //   setCollectionDrawer(true);
  //   close();
  // };

  // const onCollectionDrawerClose = () => {
  //   setCollectionDrawer(false);
  // };

  const inferType = (values, header) => {
    // const isPossibleId = values.every(value => /^\d+$/.test(value)); // 全是整数数字
    // if (header.toLowerCase().includes('id')) {
    //   if (isPossibleId) {
    //     return 'integer';
    //   }
    //   return 'string';
    // }
    const isPossibleDate = values.every((value) => !isNaN(Date.parse(value))); // 全部可解析为 Date
    if (isPossibleDate) {
      return 'date';
    }
    const types = values.map((value) => {
      if (typeof value === 'string' && (value.toLowerCase() === 'true' || value.toLowerCase() === 'false')) {
        return 'boolean';
      }
      const num = Number(value);
      if (!isNaN(num)) {
        return Number.isInteger(num) ? 'integer' : 'float';
      }
      try {
        JSON.parse(value);
        return 'json';
      } catch {}
      return 'string';
    });

    const typeCount = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    // 获取所有不同类型
    const uniqueTypes = Object.keys(typeCount);

    // 如果有超过 1 种不同类型，返回 'string'
    if (uniqueTypes.length > 1) {
      return 'string';
    }

    // 否则返回唯一的类型
    return uniqueTypes[0];
  };

  // 判断接口类型，选择适合的界面控件
  const inferInterface = (type, header) => {
    // if (header.toLowerCase().includes('id')) {
    //   return 'id';
    // }
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
        return null;
    }
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    // 当文件读取完成后
    reader.onload = async (e) => {
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

      const fields = await Promise.all(
        headers.map(async (header, index) => {
          const columnValues = rows.map((row) => row[index]);
          const type = inferType(columnValues, header);
          const interfaceType = type ? await inferInterface(type, header) : null;
          const fieldsName = `f_${uid()}`;
          return {
            name: fieldsName,
            type,
            interface: interfaceType,
            uiSchema: {
              title: header,
            },
          };
        }),
      );

      const parseValue = (value: string, type: string) => {
        try {
          switch (type) {
            case 'boolean':
              // 判断字符串 'true' 或 'false'，并转换为布尔值
              if (value.toLowerCase() === 'true') return true;
              if (value.toLowerCase() === 'false') return false;
              throw new Error('Invalid boolean');

            case 'integer':
              // 检查是否为整数，使用正则表达式
              if (!/^-?\d+$/.test(value)) throw new Error('Invalid integer');
              return parseInt(value, 10);

            case 'float':
              // 检查是否为数字（包括浮动数），使用正则表达式
              if (!/^-?\d+(\.\d+)?$/.test(value)) throw new Error('Invalid number');
              return Number(value); // 返回数字类型

            case 'json':
              // 尝试将字符串解析为 JSON
              return JSON.parse(value);

            case 'date':
              // 检查是否为有效的日期字符串
              if (isNaN(Date.parse(value))) throw new Error('Invalid date');
              return new Date(value); // 返回日期对象

            default:
              // 默认返回字符串类型
              return value; // 如果类型无法匹配，返回原始值（假设为字符串）
          }
        } catch (error) {
          throw new Error(`Type conversion error: ${error.message}`);
        }
      };

      const convertedRows = rows.map((row, rowIndex) => {
        return headers.reduce((acc, header, index) => {
          const fieldsName = fields[index]?.name;
          const type = fields[index]?.type;
          if (fieldsName && type) {
            try {
              const convertedValue = parseValue(row[index], type);
              acc[fieldsName] = convertedValue;
            } catch (error) {
              acc[fieldsName] = null;
              console.error(`Error parsing value for column "${header}" at row ${rowIndex + 1}:`, error.message);
            }
          }
          return acc;
        }, {});
      });

      const fileData = {
        fields: fields,
        data: convertedRows,
      };

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
