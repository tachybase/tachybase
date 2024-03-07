import { useAPIClient } from '@nocobase/client';
import { Button, Card, Drawer, Space, Spin, Table, Tag, Upload, message } from 'antd';
import type { UploadProps } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { FC, useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { UploadOutlined } from '@ant-design/icons';

const columns: ColumnsType<any> = [
  {
    title: '类型',
    dataIndex: 'category',
    key: 'category',
  },
  {
    title: '命名空间',
    dataIndex: 'namespace',
    key: 'namespace',
    render(value, record, index) {
      return value ? <Tag>{value}</Tag> : null;
    },
  },
  {
    title: '功能',
    dataIndex: 'function',
    key: 'function',
  },
  {
    title: '数据表标识集合',
    dataIndex: 'collections',
    key: 'collections',
    render(value, record, index) {
      return value ? (
        <span>
          {value.map((n) => (
            <Tag key={n}>{n}</Tag>
          ))}
        </span>
      ) : null;
    },
  },
  {
    title: '可导出',
    dataIndex: 'dumpable',
    key: 'dumpable',
  },
  {
    title: '数据表标识',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '数据表名称',
    dataIndex: 'title',
    key: 'title',
  },
];
const keyFn = (record) => [record.namespace ?? '', record.function ?? '', record.name ?? ''].join('_');
const RestoreButton = () => {
  const api = useAPIClient();
  const [requiredGroups, setRequiredGroups] = useState([]);
  const [optionalGroups, setOptionalGroups] = useState([]);
  const [userCollections, setUserCollections] = useState([]);
  const [selectedOptionalGroups, setSelectedOptionalGroups] = useState([]);
  const [selectedUserCollections, setSelectedUserCollections] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setLoading(true);
    api
      .resource('duplicator')
      .restore({
        values: {
          restoreKey: key,
          selectedOptionalGroups,
          selectedUserCollections,
        },
      })
      .then((res) => {
        setIsModalOpen(false);
        setLoading(false);
        message.success('恢复成功！');
      })
      .catch(() => {
        setLoading(false);
        message.error('恢复失败！');
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const props: UploadProps = {
    name: 'file',
    action: '/api/duplicator:upload',
    headers: {
      authorization: `Bearer ${api.auth.getToken()}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
        const key = info.file.response.data.key;
        const meta = info.file.response.data.meta;

        const { requiredGroups, selectedOptionalGroups, selectedUserCollections } = meta;
        setKey(key);
        setRequiredGroups(requiredGroups.map((i) => ({ ...i, category: 'required' })));
        setOptionalGroups(selectedOptionalGroups.map((i) => ({ ...i, category: 'optional' })));
        setUserCollections(
          selectedUserCollections
            .filter((i: string) => !i.startsWith('view_'))
            .map((i) => ({ name: i, category: 'user' })),
        );
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <>
      <Button onClick={showModal}>恢复</Button>
      <Drawer
        title="恢复"
        open={isModalOpen}
        onClose={handleCancel}
        width={1200}
        extra={
          <Space>
            <Button onClick={handleCancel} loading={loading}>
              取消
            </Button>
            <Button onClick={handleOk} type="primary" loading={loading}>
              提交
            </Button>
          </Space>
        }
      >
        <Spin spinning={loading}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>选择要恢复的文件</Button>
          </Upload>
          {requiredGroups.length !== 0 && (
            <Table
              rowKey={keyFn}
              columns={columns}
              dataSource={[...requiredGroups, ...optionalGroups, ...userCollections]}
              rowSelection={{
                type: 'checkbox',
                onChange(selectedRowKeys: React.Key[], selectedRows: any[]) {
                  setSelectedOptionalGroups(
                    selectedRows
                      .filter((item) => item.category === 'optional')
                      .map((item) => item.namespace + '.' + item.function),
                  );
                  setSelectedUserCollections(
                    selectedRows.filter((item) => item.category === 'user').map((item) => item.name),
                  );
                },
                getCheckboxProps(record) {
                  return {
                    disabled: record.category === 'required',
                  };
                },
                defaultSelectedRowKeys: requiredGroups.map(keyFn),
              }}
              pagination={{
                pageSize: 200,
              }}
            />
          )}
        </Spin>
      </Drawer>
    </>
  );
};
export const BackupCenterPanel = () => {
  const api = useAPIClient();
  const [requiredGroups, setRequiredGroups] = useState([]);
  const [optionalGroups, setOptionalGroups] = useState([]);
  const [userCollections, setUserCollections] = useState([]);
  const [selectedOptionalGroups, setSelectedOptionalGroups] = useState([]);
  const [selectedUserCollections, setSelectedUserCollections] = useState([]);
  useEffect(() => {
    api
      .resource('duplicator')
      .dumpableCollections()
      .then((res) => {
        const { requiredGroups, optionalGroups, userCollections } = res.data;
        setRequiredGroups(requiredGroups.map((i) => ({ ...i, category: 'required' })));
        setOptionalGroups(optionalGroups.map((i) => ({ ...i, category: 'optional' })));
        setUserCollections(
          userCollections
            .filter((i: { name: string }) => !i.name.startsWith('view_'))
            .map((i) => ({ ...i, category: 'user' })),
        );
      })
      .catch(() => {
        // ignore-error
      });
  }, [api]);
  if (requiredGroups.length === 0) {
    return null;
  }
  return (
    <Card bordered={false}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Space>&nbsp;</Space>
        <Space>
          <Button
            onClick={async () => {
              const response = await api.axios.post(
                '/duplicator:dump',
                {
                  selectedOptionalGroupNames: selectedOptionalGroups,
                  selectedUserCollections: selectedUserCollections,
                },
                { responseType: 'arraybuffer' },
              );
              const blob = new Blob([response.data], { type: 'application/octet-stream' });
              saveAs(blob, 'backup.nbdump');
            }}
          >
            备份
          </Button>
          <RestoreButton />
        </Space>
      </div>
      <Table
        rowKey={keyFn}
        columns={columns}
        dataSource={[...requiredGroups, ...optionalGroups, ...userCollections]}
        rowSelection={{
          type: 'checkbox',
          onChange(selectedRowKeys: React.Key[], selectedRows: any[]) {
            setSelectedOptionalGroups(
              selectedRows
                .filter((item) => item.category === 'optional')
                .map((item) => item.namespace + '.' + item.function),
            );
            setSelectedUserCollections(
              selectedRows.filter((item) => item.category === 'user').map((item) => item.name),
            );
          },
          getCheckboxProps(record) {
            return {
              disabled: record.category === 'required',
            };
          },
          defaultSelectedRowKeys: requiredGroups.map(keyFn),
        }}
        pagination={{
          pageSize: 200,
        }}
      />
    </Card>
  );
};
