import { observer } from '@tachybase/schema';

import { Table } from 'antd';
import { useTranslation } from 'react-i18next';

export const xlsxPreviewTable = observer(
  (props: any) => {
    const { filedata } = props;
    const { t } = useTranslation();
    const previewTablecolumns = filedata.fields.map((field) => ({
      title: field.uiSchema.title,
      dataIndex: field.name,
      key: field.name,
      render: (text) => text,
      width: 200,
    }));

    return (
      <Table
        bordered
        size="small"
        columns={previewTablecolumns}
        dataSource={filedata.data}
        scroll={{ y: 300, x: 'max-content' }}
        pagination={false}
        rowKey="name"
      />
    );
  },
  { displayName: 'PreviewTable' },
);
