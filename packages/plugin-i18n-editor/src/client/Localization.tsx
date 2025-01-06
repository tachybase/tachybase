import React, { useEffect, useMemo, useState } from 'react';
import {
  FormProvider,
  Input,
  locale,
  Radio,
  SchemaComponent,
  Select,
  StablePopover,
  useActionContext,
  useAPIClient,
  useBlockRequestContext,
  useCollectionRecordData,
  useDataBlockRequest,
} from '@tachybase/client';
import { createForm, FieldComponent as Field, Form, useField, useForm } from '@tachybase/schema';

import { SyncOutlined } from '@ant-design/icons';
import { useMemoizedFn } from 'ahooks';
import { Input as AntdInput, Button, Card, Checkbox, Col, Divider, message, Row, Tag, Typography } from 'antd';

import { useLocalTranslation } from './locale';
import { localizationSchema } from './schemas/localization';

const { Text } = Typography;

const useUpdateTranslationAction = () => {
  const field = useField();
  const form = useForm();
  const ctx = useActionContext();
  const { __parent } = useBlockRequestContext();
  const service = useDataBlockRequest();
  // const { refresh } = useDataBlockRequest();
  const record = useCollectionRecordData();
  const textId = record?.id;
  const api = useAPIClient();
  const locale = api.auth.getLocale();
  return {
    async onClick() {
      await form.submit();
      field.data = field.data || {};
      field.data.loading = true;
      try {
        await api.resource('localizationTranslations').updateOrCreate({
          filterKeys: ['textId', 'locale'],
          values: {
            textId,
            locale,
            translation: form.values.translation,
          },
        });
        ctx.setVisible(false);
        await form.reset();
        // service.refresh();
        __parent?.service?.refresh();
      } catch (e) {
        console.log(e);
      } finally {
        field.data.loading = false;
      }
    },
  };
};

const useDestroyTranslationAction = () => {
  const { refresh } = useDataBlockRequest();
  const api = useAPIClient();
  const { translationId: filterByTk } = useCollectionRecordData();
  return {
    async onClick() {
      await api.resource('localizationTranslations').destroy({ filterByTk });
      refresh();
    },
  };
};

const useBulkDestroyTranslationAction = () => {
  const { field } = useBlockRequestContext();
  const { setState, refresh } = useDataBlockRequest();
  const api = useAPIClient();
  const { t } = useLocalTranslation();
  return {
    async onClick() {
      if (!field?.data?.selectedRowKeys?.length) {
        return message.error(t('Please select the records you want to delete'));
      }
      await api.resource('localization').destroyTrans({
        values: {
          textIds: field?.data?.selectedRowKeys,
        },
      });
      setState?.({ selectedRowKeys: [] });
      refresh();
    },
  };
};

const usePublishAction = () => {
  const api = useAPIClient();
  return {
    async onClick() {
      await api.resource('localization').publish();
      window.location.reload();
    },
  };
};

const Sync = () => {
  const { t } = useLocalTranslation();
  const { refresh } = useDataBlockRequest();
  const api = useAPIClient();
  const [loading, setLoading] = useState(false);
  const plainOptions = ['local', 'menu', 'db'];
  const [checkedList, setCheckedList] = useState<any[]>(plainOptions);
  const [indeterminate, setIndeterminate] = useState(false);
  const [checkAll, setCheckAll] = useState(true);
  const onChange = (list: any[]) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <StablePopover
      placement="bottomRight"
      content={
        <>
          <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
            {t('All')}
          </Checkbox>
          <Divider style={{ margin: '5px 0' }} />
          <Checkbox.Group onChange={onChange} value={checkedList}>
            <Col>
              <Row>
                <Checkbox value="local">{t('System & Plugins')}</Checkbox>
              </Row>
              <Row>
                <Checkbox value="db">{t('Collections & Fields')}</Checkbox>
              </Row>
              <Row>
                <Checkbox value="menu">{t('Menu')}</Checkbox>
              </Row>
            </Col>
          </Checkbox.Group>
        </>
      }
    >
      <Button
        icon={<SyncOutlined />}
        loading={loading}
        onClick={async () => {
          if (!checkedList.length) {
            return message.error(t('Please select the resources you want to synchronize'));
          }
          setLoading(true);
          await api.resource('localization').sync({
            values: {
              type: checkedList,
            },
          });
          setLoading(false);
          refresh();
        }}
      >
        {t('Sync')}
      </Button>
    </StablePopover>
  );
};

const useModules = () => {
  const { t: lang } = useLocalTranslation();
  const t = useMemoizedFn(lang);
  const { data } = useDataBlockRequest();
  return useMemo(
    () =>
      data?.meta?.modules?.map((module) => ({
        value: module.value,
        label: t(module.label),
      })) || [],
    [data?.meta?.modules, t],
  );
};

const Filter = () => {
  const { t } = useLocalTranslation();
  const { run } = useDataBlockRequest();
  const modules = useModules();
  const form = useMemo<Form>(
    () =>
      createForm({
        initialValues: {
          hasTranslation: true,
        },
      }),
    [],
  );
  const filter = (values?: any) => {
    run({
      ...(values || form.values),
    });
  };
  useEffect(() => {
    const module = form.query('module').take() as any;
    module.dataSource = modules;
  }, [form, modules]);

  return (
    <FormProvider form={form}>
      <div style={{ display: 'flex' }}>
        <Field
          name="module"
          dataSource={modules}
          component={[
            Select,
            {
              allowClear: true,
              placeholder: t('Module'),
              onChange: (module: string) => filter({ ...form.values, module }),
            },
          ]}
        />
        <Field
          name="keyword"
          component={[
            AntdInput.Search,
            {
              placeholder: t('Keyword'),
              allowClear: true,
              style: {
                marginLeft: '8px',
                width: 'fit-content',
              },
              onSearch: (keyword) => filter({ ...form.values, keyword }),
            },
          ]}
        />
        <Field
          name="hasTranslation"
          dataSource={[
            { label: t('All'), value: true },
            { label: t('No translation'), value: false },
          ]}
          component={[
            Radio.Group,
            {
              defaultValue: true,
              style: {
                marginLeft: '8px',
                width: 'fit-content',
              },
              optionType: 'button',
              onChange: () => filter(),
            },
          ]}
        />
      </div>
    </FormProvider>
  );
};

export const Localization = () => {
  const { t } = useLocalTranslation();
  const api = useAPIClient();
  const curLocale = api.auth.getLocale();
  const localeLabel = locale[curLocale]?.label || curLocale;

  const CurrentLang = () => (
    <Typography>
      <Text strong>{t('Current language')}</Text>
      <Tag style={{ marginLeft: '10px' }}>{localeLabel}</Tag>
    </Typography>
  );

  const TranslationField = (props) => (props.value !== undefined ? <Input.TextArea {...props} /> : <div></div>);
  return (
    <Card bordered={false}>
      <SchemaComponent
        schema={localizationSchema}
        components={{ TranslationField, CurrentLang, Sync, Filter }}
        scope={{
          t,
          useDestroyTranslationAction,
          useBulkDestroyTranslationAction,
          useUpdateTranslationAction,
          usePublishAction,
          useModules,
        }}
      />
    </Card>
  );
};
