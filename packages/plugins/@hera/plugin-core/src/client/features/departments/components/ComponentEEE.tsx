import { UserOutlined } from '@ant-design/icons';
import { ActionContextProvider, RecordProvider, SchemaComponent, SchemaComponentOptions } from '@tachybase/client';
import { Button, Divider, Row, theme } from 'antd';
import React, { useContext, useState } from 'react';
import { useTranslation } from '../../../locale';
import { contextK } from '../context/contextK';
import { ContextNProvider } from '../context/contextN';
import { useCreateDepartment } from '../hooks/useCreateDepartment';
import { useHooksG } from '../hooks/useHooksG';
import { useUpdateDepartmentLe } from '../hooks/useUpdateDepartmentLe';
import { ComponentSe } from './ComponentSe';
import { ComponentX } from './ComponentX';
import { ComponentXxe } from './ComponentXxe';
import { DepartmentOwnersField } from './DepartmentOwnersField';

interface drawerState {
  node?: object;
  schema?: object;
}

export const ComponentEEE = () => {
  const { t: tval } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [drawer, setDrawer] = useState<drawerState>({});

  const { department, setDepartment } = useContext(contextK);
  const { token } = theme.useToken();
  const m = useHooksG({
    label: ({ node }) => <ComponentX.Item node={node} setVisible={setVisible} setDrawer={setDrawer} />,
  });

  return (
    <SchemaComponentOptions
      scope={{
        useCreateDepartment,
        useUpdateDepartment: useUpdateDepartmentLe,
      }}
    >
      <ContextNProvider value={m}>
        <Row>
          <ComponentSe />
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
            {tval('All users')}
          </Button>
          <ComponentXxe />
        </Row>
        <Divider style={{ margin: '12px 0' }} />
        <ComponentX />
        <ActionContextProvider
          value={{
            visible: visible,
            setVisible: setVisible,
          }}
        >
          <RecordProvider record={drawer.node || {}}>
            <SchemaComponent
              scope={{
                t: tval,
              }}
              components={{
                DepartmentOwnersField,
              }}
              schema={drawer.schema || {}}
            />
          </RecordProvider>
        </ActionContextProvider>
      </ContextNProvider>
    </SchemaComponentOptions>
  );

  // return jsx(SchemaComponentOptions, {
  //   scope: {
  //     useCreateDepartment: useCreateDepartment,
  //     useUpdateDepartment: useUpdateDepartmentLe,
  //   },
  //   children: jsxs(contextN.Provider, {
  //     value: m,
  //     children: [
  //       jsxs(Row, {
  //         children: [
  //           jsx(ComponentSe, {}),
  //           jsx(Button, {
  //             type: 'text',
  //             icon: jsx(UserOutlined, {}),
  //             style: { textAlign: 'left', marginBottom: '5px', background: c ? '' : x.colorBgTextHover },
  //             onClick: () => {
  //               i(null);
  //             },
  //             block: true,
  //             children: e('All users'),
  //           }),
  //           jsx(ComponentXxe, {}),
  //         ],
  //       }),
  //       jsx(Divider, { style: { margin: '12px 0' } }),
  //       jsx(ComponentX, {}),
  //       jsx(ActionContextProvider, {
  //         value: { visible: t, setVisible: o },
  //         children: jsx(RecordProvider, {
  //           record: a.node || {},
  //           children: jsx(SchemaComponent, {
  //             scope: { t: e },
  //             components: { DepartmentOwnersField: DepartmentOwnersField },
  //             schema: a.schema || {},
  //           }),
  //         }),
  //       }),
  //     ],
  //   }),
  // });
};
