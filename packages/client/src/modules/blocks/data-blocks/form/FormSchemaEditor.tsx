import { useRef, useState } from 'react';

import { EditOutlined, LeftOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Input, Layout, Menu, Modal, Tooltip, type ModalProps } from 'antd';

import { useStyles } from './styles';

interface FormSchemaEditorProps extends Pick<ModalProps, 'open' | 'onCancel'> {}

export const FormSchemaEditor = ({ open, onCancel }: FormSchemaEditorProps) => {
  const { Header, Content, Sider } = Layout;
  const { styles } = useStyles();

  return (
    <Modal open={open} footer={null} width="100vw" closable={false} className={styles.editModel}>
      <Layout style={{ height: '100%' }}>
        <EditorHeader onCancel={onCancel} />
        <Layout>
          <Sider width={300} style={{ background: 'white' }}>
            <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%' }}>
              <Menu.Item key="1">Left Menu 1</Menu.Item>
              <Menu.Item key="2">Left Menu 2</Menu.Item>
            </Menu>
          </Sider>
          <Content>main content</Content>
          <Sider width={300} style={{ background: 'white' }}>
            <Menu mode="inline" defaultSelectedKeys={['1']} style={{ height: '100%' }}>
              <Menu.Item key="1">Right Menu 1</Menu.Item>
              <Menu.Item key="2">Right Menu 2</Menu.Item>
            </Menu>
          </Sider>
        </Layout>
      </Layout>
    </Modal>
  );
};

const EditorHeader = ({ onCancel }) => {
  const { Header, Content, Sider } = Layout;
  const { styles } = useStyles();
  const [title, setTitle] = useState('未命名表单');
  const [modalVisible, setModalVisible] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleSave = () => {
    setTitle(tempTitle || '未命名表单');
    setModalVisible(false);
  };

  return (
    <>
      <Header className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button icon={<LeftOutlined />} onClick={onCancel} type="text" className="ant-cancel-button" />
          <span className="ant-form-title">{title}</span>
          <EditOutlined
            onClick={() => {
              setTempTitle(title);
              setModalVisible(true);
            }}
            style={{ cursor: 'pointer' }}
          />
        </div>
        {/* 中间：菜单，绝对居中 */}
        <div className="center-menu">
          <Menu mode="horizontal" selectedKeys={['formEdit']}>
            <Menu.Item key="formEdit" style={{ fontSize: 'large' }}>
              表单设计
            </Menu.Item>
          </Menu>
          <Tooltip title="通过选择字段、调整位置、添加属性等对表单进行设计">
            <QuestionCircleOutlined />
          </Tooltip>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Button className="ant-save-button">预览</Button>
          <Button type="primary" className="ant-save-button">
            保存
          </Button>
        </div>
      </Header>
      <Modal title="编辑表单名称" open={modalVisible} onCancel={() => setModalVisible(false)} onOk={handleSave}>
        <Input value={tempTitle} onChange={(e) => setTempTitle(e.target.value)} placeholder="请输入表单名称" />
      </Modal>
    </>
  );
};
