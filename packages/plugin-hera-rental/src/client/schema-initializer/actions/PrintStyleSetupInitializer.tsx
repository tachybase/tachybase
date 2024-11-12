import React, { useContext, useEffect, useState } from 'react';
import { ActionInitializer, useAPIClient, useCurrentUserContext, useRequest } from '@tachybase/client';

import { DeleteOutlined, VerticalAlignBottomOutlined, VerticalAlignTopOutlined } from '@ant-design/icons';
import { Button, Form, Input, message, Popover, Radio, Select, Space, Spin } from 'antd';

import { PrintStyleContext } from '../../hooks/usePdfPath';
import { tval, useTranslation } from '../../locale';

type FieldType = {
  name: string;
  margin: string;
  fontSize: string;
  size: string;
  orientation: string;
  column: 'single' | 'double';
  comment: 'classical' | 'unified';
};

const MarginInput = (props) => {
  const values = props.value ?? [0, 0, 0, 0];
  return (
    <Space.Compact>
      <Input
        value={values[0]}
        onChange={(v) => {
          values[0] = Number(v.target.value);
          props.onChange([...values]);
        }}
        prefix={<VerticalAlignTopOutlined rotate={0} />}
      ></Input>
      <Input
        value={values[1]}
        onChange={(v) => {
          values[1] = Number(v.target.value);
          props.onChange([...values]);
        }}
        prefix={<VerticalAlignBottomOutlined />}
      ></Input>
      <Input
        value={values[2]}
        onChange={(v) => {
          values[2] = Number(v.target.value);
          props.onChange([...values]);
        }}
        prefix={<VerticalAlignTopOutlined rotate={-90} />}
      ></Input>
      <Input
        value={values[3]}
        onChange={(v) => {
          values[3] = Number(v.target.value);
          props.onChange([...values]);
        }}
        prefix={<VerticalAlignTopOutlined rotate={90} />}
      ></Input>
    </Space.Compact>
  );
};

const StyleSetupContent = ({ setOpen, initialValues, refresh }) => {
  const { t } = useTranslation();
  const api = useAPIClient();
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields(Object.keys(initialValues));
  }, [initialValues, form]);
  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ width: 450 }}
      initialValues={{ ...initialValues, name: (initialValues?.name ?? '') + t('new') }}
      onFinish={(values) => {
        api
          .resource('printStyles')
          .updateOrCreate({
            values,
            filterKeys: ['name'],
          })
          .then(() => {
            setOpen(false);
            refresh();
            message.success(t('Success'));
          })
          .catch(console.error);
      }}
      autoComplete="off"
    >
      <Form.Item<FieldType> label={t('Name')} name="name" required>
        <Input />
      </Form.Item>
      <Form.Item<FieldType> label={t('Margin')} name="margin" required>
        <MarginInput />
      </Form.Item>
      <Form.Item<FieldType> label={t('Font size')} name="fontSize" required wrapperCol={{ span: 8 }}>
        <Input suffix="pt" />
      </Form.Item>
      <Form.Item<FieldType> label={t('Paper size')} name="size" required>
        <Radio.Group
          options={[
            { label: t('A3'), value: 'A3' },
            { label: t('A4'), value: 'A4' },
            { label: t('A5'), value: 'A5' },
            { label: t('B4'), value: 'B4' },
            { label: t('B5'), value: 'B5' },
          ]}
          buttonStyle="solid"
          optionType="button"
        />
      </Form.Item>
      <Form.Item<FieldType> label={t('Paper orientation')} name="orientation" required>
        <Radio.Group
          options={[
            { label: t('Landscape'), value: 'landscape' },
            { label: t('Portrait'), value: 'portrait' },
          ]}
          buttonStyle="solid"
          optionType="button"
        />
      </Form.Item>
      <Form.Item<FieldType> label={t('Column style')} name="column" required>
        <Radio.Group
          options={[
            { label: t('Single column'), value: 'single' },
            { label: t('Double column'), value: 'double' },
          ]}
          buttonStyle="solid"
          optionType="button"
        />
      </Form.Item>
      <Form.Item<FieldType> label={t('Comment style')} name="comment" required>
        <Radio.Group
          options={[
            { label: t('Classical'), value: 'classical' },
            { label: t('Unified'), value: 'unified' },
          ]}
          buttonStyle="solid"
          optionType="button"
        />
      </Form.Item>
      <Form.Item wrapperCol={{ span: 24 }}>
        <Button type="primary" htmlType="submit" block>
          {t('Save')}
        </Button>
      </Form.Item>
    </Form>
  );
};

export const StyleSetup = () => {
  const { t } = useTranslation();
  const api = useAPIClient();
  const { styleId, setStyleId } = useContext(PrintStyleContext);
  const [open, setOpen] = useState(false);
  const { data } = useCurrentUserContext();
  const userId = data.data?.id;
  const users = useRequest<any>({
    resource: 'users',
    action: 'get',
    params: {
      filter: {
        id: userId,
      },
      appends: ['defaultPrintStyle'],
    },
  });
  const printStyles = useRequest<any>({
    resource: 'printStyles',
    action: 'list',
  });

  useEffect(() => {
    if (styleId === -1) {
      if (users.data?.data?.defaultPrintStyle) {
        setStyleId(users.data.data.defaultPrintStyle.id);
      } else if (printStyles.data?.data && printStyles.data?.data.length > 0) {
        setStyleId(printStyles.data.data[0].id);
      }
    }
  }, [styleId, users, setStyleId, printStyles]);

  if (users.loading && !users.data) {
    return <Spin />;
  }

  if (printStyles.loading && !printStyles.data) {
    return <Spin />;
  }

  const defaultStyle = users.data.data.defaultPrintStyle;
  const styles = printStyles.data.data;

  return (
    <Space.Compact>
      <Select
        options={printStyles.data?.data?.map((v) => ({ label: v.name, value: v.id }))}
        value={styleId}
        optionRender={(option) => (
          <span style={{ display: 'inline-flex', width: '100%' }}>
            <span style={{ flex: 1 }}>{option.label}</span>
            {styles.length > 1 && (
              <DeleteOutlined
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  api
                    .resource('printStyles')
                    .destroy({
                      filterByTk: option.value,
                    })
                    .then(() => {
                      printStyles.refresh();
                    })
                    .catch(console.error);
                }}
              />
            )}
          </span>
        )}
        onChange={(i) => {
          setStyleId(i);
          api.resource('users').update({
            filterByTk: userId,
            values: {
              defaultPrintStyleId: i,
            },
          });
        }}
      />
      <Popover
        content={
          <StyleSetupContent
            refresh={() => printStyles.refresh()}
            setOpen={setOpen}
            initialValues={{ margin: [12, 12, 12, 12], ...styles.find((style) => style.id === styleId) }}
          />
        }
        placement="bottom"
        trigger="click"
        open={open}
        onOpenChange={setOpen}
      >
        <Button>{t('Add new style')}</Button>
      </Popover>
    </Space.Compact>
  );
};

export const PrintStyleSetupInitializer = (props) => {
  const schema = {
    title: tval('Style setup'),
    'x-component': 'StyleSetup',
  };
  return <ActionInitializer {...props} schema={schema} />;
};
