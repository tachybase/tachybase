import React, { useEffect, useState } from 'react';
import { Button, Drawer, Form, Input, Select, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useRequest } from '@tachybase/client';
export const LinkManager = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [tableData, setTableData] = useState<any>([]);
  const { data, run } = useRequest<{ data: any }>({
    url: `/link-manage:get`,
  });
  const { run: updateLink } = useRequest<{ data: any }>({
    url: `/link-manage:set`,
    params: { id: formData.id, link: formData.link },
  });
  useEffect(() => {
    if (data) {
      setTableData(data.data);
    }
  }, [data]);
  const showDrawer = (record) => {
    setFormData(record);
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const update = () => {
    updateLink();
    // 更新表格数据
    const mergedArray = tableData.map((item) => {
      const matchingItem = item.id === formData.id;
      if (matchingItem) {
        return formData;
      }
      return item;
    });
    setTableData(mergedArray);
    setOpen(false);
    setFormData({});
  };
  const columns: ColumnsType = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '链接',
      dataIndex: 'link',
      key: 'link',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showDrawer(record)}>编辑</a>
        </Space>
      ),
    },
  ];

  return (
    <>
      {tableData && <Table columns={columns} dataSource={tableData}></Table>}
      <Drawer
        title="设定链接地址"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>关闭</Button>
            <Button onClick={update} type="primary">
              提交
            </Button>
          </Space>
        }
      >
        <Form layout="vertical">
          <Form.Item name="name" label="Name">
            <Input placeholder="Please enter Name" defaultValue={formData?.name} disabled />
          </Form.Item>
          <Form.Item name="link" label="Link">
            <Input
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="Please enter Link"
              defaultValue={formData?.link}
            />
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
