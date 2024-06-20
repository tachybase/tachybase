import React, { useContext, useState } from 'react';
import { ActionContextProvider, RecordProvider, SchemaComponent, SchemaComponentOptions } from '@tachybase/client';

import { UserOutlined } from '@ant-design/icons';
import { Button, Divider, Row, theme } from 'antd';

import { useTranslation } from '../../../locale';
import { DepartmentsContext } from '../context/DepartmentsContext';
import { DepartmentsExpandedContextProvider } from '../context/DepartmentsExpandedContext';
import { useCreateDepartment } from '../hooks/useCreateDepartment';
import { useDepTree2 } from '../hooks/useDepTree2';
import { useUpdateDepartment } from '../hooks/useUpdateDepartment';
import { DepartmentsTree } from './ComponentSe';
import { ComponentX } from './ComponentX';
import { DepartmentOwnersField } from './DepartmentOwnersField';
import { NewDepartment } from './NewDepartment';

interface drawerState {
  node?: object;
  schema?: object;
}

export const DepartmentsBlock = () => {
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [drawer, setDrawer] = useState<drawerState>({});

  const { department, setDepartment } = useContext(DepartmentsContext);
  const { token } = theme.useToken();
  const m = useDepTree2({
    label: ({ node }) => <ComponentX.Item node={node} setVisible={setVisible} setDrawer={setDrawer} />,
  });

  return (
    <SchemaComponentOptions
      scope={{
        useCreateDepartment,
        useUpdateDepartment,
      }}
    >
      <DepartmentsExpandedContextProvider value={m}>
        <Row>
          <DepartmentsTree />
          <Button
            type="text"
            icon={<UserOutlined />}
            style={{
              textAlign: 'left',
              marginBottom: '5px',
              background: department ? '' : token.colorBgTextHover,
            }}
            onClick={() => {
              setDepartment(null);
            }}
            block={true}
          >
            {t('All users')}
          </Button>
          <NewDepartment />
        </Row>
        <Divider style={{ margin: '12px 0' }} />
        <ComponentX />
        <ActionContextProvider
          value={{
            visible,
            setVisible,
          }}
        >
          <RecordProvider record={drawer.node || {}}>
            <SchemaComponent
              scope={{
                t,
              }}
              components={{
                DepartmentOwnersField,
              }}
              schema={drawer.schema || {}}
            />
          </RecordProvider>
        </ActionContextProvider>
      </DepartmentsExpandedContextProvider>
    </SchemaComponentOptions>
  );
};
