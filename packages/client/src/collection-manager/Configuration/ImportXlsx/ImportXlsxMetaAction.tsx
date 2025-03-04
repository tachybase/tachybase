import React, { useImperativeHandle, useState } from 'react';
import { uid } from '@tachybase/schema';

import { InboxOutlined } from '@ant-design/icons';
import { App, Button, Drawer, message, Spin, Upload, UploadFile, UploadProps } from 'antd';
import { useTranslation } from 'react-i18next';
import * as XLSX from 'xlsx';

import { ActionContextProvider, SchemaComponent } from '../../../schema-component';
import { createXlsxCollectionSchema } from './XlsxCollectionSchema';
import { xlsxImportAction } from './XlsxEditFieldAction';
import { xlsxFieldsConfigure } from './xlsxFieldsConfigure';
import { xlsxPreviewTable } from './xlsxPreviewTable';

const { Dragger } = Upload;

const ImportUpload = (props: any) => {
  const { t } = useTranslation();
  const { close } = props;
  const [fileList, setFile] = useState<UploadFile[]>([]);
  const [filedata, setFileData] = useState({});
  const [visible, setVisible] = useState(false);
  const [schema, setSchema] = useState({});

  const inferType = (values, header) => {
    const isDateHeader = /date|time|日期/i.test(header);
    const isPossibleDate = isDateHeader && values.every((value) => !isNaN(Date.parse(value)));
    if (isPossibleDate) {
      return 'date';
    }
    const types = values.map((value) => {
      if (value !== undefined && value !== null) {
        const valueLower = value.toString().toLowerCase();
        if (valueLower === 'true' || valueLower === 'yes') {
          return 'boolean';
        }
        if (valueLower === 'false' || valueLower === 'no') {
          return 'boolean';
        }
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
    const uniqueTypes = Object.keys(typeCount);

    if (uniqueTypes.length > 1) {
      return 'string';
    }

    return uniqueTypes[0];
  };

  const inferInterface = (type, header) => {
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
    reader.onload = async (e) => {
      const binaryStr = e.target.result; // 获取文件内容
      const workbook = XLSX.read(binaryStr, { type: 'binary' }); // 解析工作簿

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

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
            case 'boolean': {
              const valueLower = value.toString().toLowerCase();
              if (valueLower === 'true' || valueLower === 'yes') return true;
              if (valueLower === 'false' || valueLower === 'no') return false;
              throw new Error('Invalid boolean');
            }
            case 'integer':
              if (!/^-?\d+$/.test(value)) throw new Error('Invalid integer');
              return parseInt(value, 10);

            case 'float':
              if (!/^-?\d+(\.\d+)?$/.test(value)) throw new Error('Invalid number');
              return Number(value);

            case 'json':
              return JSON.parse(value);

            case 'date':
              if (isNaN(Date.parse(value))) throw new Error('Invalid date');
              return new Date(value);

            default:
              if (value === null || value === undefined || value === '') {
                return '';
              }
              return value.toString();
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
              message.error(`Error in column "${header}" at row ${rowIndex + 1}: ${error.message}`);
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
      const isExcel =
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xlsx') ||
        file.name.endsWith('.xls');
      if (!isExcel) {
        message.error(t('You can only upload Excel files!'));
        return Upload.LIST_IGNORE;
      }
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
          {t('Upload')}
        </Button>
        <SchemaComponent
          schema={schema}
          components={{
            xlsxFieldsConfigure,
          }}
          scope={{
            xlsxPreviewTable,
            xlsxImportAction,
          }}
        />
      </ActionContextProvider>
    </>
  );
};

export const ImportXlsxMetaAction = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
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
  };
  return (
    <>
      <Drawer title={t('Import collection')} footer={undefined} open={isModalOpen} onClose={handleCancel}>
        <Spin spinning={loading}>
          <ImportUpload close={handleCancel} />
        </Spin>
      </Drawer>
    </>
  );
});
