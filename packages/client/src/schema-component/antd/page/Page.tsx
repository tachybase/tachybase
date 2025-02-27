import { useContext, useEffect, useMemo, useState } from 'react';
import { FormLayout } from '@tachybase/components';
import { Schema, SchemaOptionsContext, useFieldSchema } from '@tachybase/schema';

import { PlusOutlined } from '@ant-design/icons';
import { PageHeader as AntdPageHeader } from '@ant-design/pro-layout';
import { Button, Tabs } from 'antd';
import classNames from 'classnames';
import { ErrorBoundary } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { FormDialog, ScrollArea } from '..';
import { useToken } from '../__builtins__';
import { useStyles as useAClStyles } from '../../../built-in/acl/style';
import { useContextMenu } from '../../../built-in/context-menu/useContextMenu';
import { useDocumentTitle } from '../../../built-in/document-title';
import { FilterBlockProvider } from '../../../filter-provider/FilterProvider';
import { Icon } from '../../../icon';
import { useGetAriaLabelOfSchemaInitializer } from '../../../schema-initializer/hooks/useGetAriaLabelOfSchemaInitializer';
import { useGlobalTheme } from '../../../style/theme';
import { DndContext } from '../../common';
import { SortableItem } from '../../common/sortable-item';
import { SchemaComponent, SchemaComponentOptions } from '../../core';
import { useCompile, useDesignable } from '../../hooks';
import { ErrorFallback } from '../error-fallback';
import FixedBlock from './FixedBlock';
import { useStyles } from './Page.style';
import { PageDesigner, PageTabDesigner } from './PageTabDesigner';
import { getStyles } from './style';

export const Page = (props) => {
  const { children, ...others } = props;
  const { t } = useTranslation();

  const { title, setTitle } = useDocumentTitle();
  const fieldSchema = useFieldSchema();
  const disablePageHeader = fieldSchema['x-component-props']?.disablePageHeader;
  const enablePageTabs = fieldSchema['x-component-props']?.enablePageTabs;

  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const activeKey = useMemo(
    () => searchParams.get('tab') || Object.keys(fieldSchema.properties || {}).shift(),
    [fieldSchema.properties, searchParams],
  );
  const [height, setHeight] = useState(0);
  const aclStyles = useAClStyles();
  const { wrapSSR, hashId, componentCls } = getStyles();

  useEffect(() => {
    if (!title) {
      setTitle(t(fieldSchema.title));
    }
  }, [fieldSchema.title, title]);

  return wrapSSR(
    <FilterBlockProvider>
      <div className={`${componentCls} ${hashId} ${aclStyles.styles}`}>
        <PageDesigner title={fieldSchema.title || title} />
        <PageHeader
          disablePageHeader={disablePageHeader}
          enablePageTabs={enablePageTabs}
          activeKey={activeKey}
          title={title}
          fieldSchema={fieldSchema}
          parentProps={others}
          setHeight={setHeight}
          setLoading={setLoading}
          setSearchParams={setSearchParams}
        />
        <PageContentComponent
          loading={loading}
          disablePageHeader={disablePageHeader}
          enablePageTabs={enablePageTabs}
          fieldSchema={fieldSchema}
          activeKey={activeKey}
          height={height}
        >
          {children}
        </PageContentComponent>
      </div>
    </FilterBlockProvider>,
  );
};

const PageHeader = (props) => {
  const {
    disablePageHeader,
    enablePageTabs,
    setHeight,
    activeKey,
    setLoading,
    setSearchParams,
    fieldSchema,
    title,
    parentProps,
  } = props;

  const { theme } = useGlobalTheme();
  const options = useContext(SchemaOptionsContext);
  const compile = useCompile();

  const { hiddenScrollArea } = useContextMenu();

  const hidePageTitle = fieldSchema['x-component-props']?.hidePageTitle;

  const pageHeaderTitle = hidePageTitle ? undefined : fieldSchema.title || compile(title);

  // THINK: 思考下这里怎么缓存, 直接用 useMemo 是不行的
  const items = fieldSchema.mapProperties((schema) => ({
    key: schema.name as string,
    label: <TabItem schema={schema} />,
  }));

  return (
    <div
      ref={(ref) => {
        setHeight(Math.floor(ref?.getBoundingClientRect().height || 0) + 1);
      }}
      className="tb-page-header-wrapper"
    >
      {!disablePageHeader && (
        <AntdPageHeader
          className={classNames('pageHeaderCss', pageHeaderTitle || enablePageTabs ? '' : 'height0')}
          ghost={false}
          // 如果标题为空的时候会导致 PageHeader 不渲染，所以这里设置一个空白字符，然后再设置高度为 0
          title={pageHeaderTitle || ' '}
          {...parentProps}
          extra={!enablePageTabs && !hiddenScrollArea && <ScrollArea />}
          footer={
            enablePageTabs && (
              <TabComponent
                activeKey={activeKey}
                setLoading={setLoading}
                setSearchParams={setSearchParams}
                hiddenScrollArea={hiddenScrollArea}
                options={options}
                theme={theme}
                items={items}
              />
            )
          }
        />
      )}
    </div>
  );
};

const TabComponent = (props) => {
  const { activeKey, setLoading, setSearchParams, hiddenScrollArea, options, theme, items } = props;

  const { styles } = useStyles();

  // react18  tab 动画会卡顿，所以第一个 tab 时，动画禁用，后面的 tab 才启用
  const [hasMounted, setHasMounted] = useState(false);

  const handleTabClick = (activeKey) => {
    setLoading(true);
    setSearchParams([['tab', activeKey]]);
    setTimeout(() => {
      setLoading(false);
    }, 50);
  };

  useEffect(() => {
    setTimeout(() => {
      setHasMounted(true);
    });
  }, []);

  return (
    <DndContext>
      <Tabs
        className={styles.tabComponentClass}
        type="card"
        size={'small'}
        animated={hasMounted}
        activeKey={activeKey}
        items={items}
        onTabClick={handleTabClick}
        tabBarExtraContent={<TabBarExtraContent theme={theme} hiddenScrollArea={hiddenScrollArea} options={options} />}
      />
    </DndContext>
  );
};

const TabItem = (props) => {
  const { schema } = props;
  const { t } = useTranslation();

  return (
    <SortableItem
      id={schema.name as string}
      schema={schema}
      className={classNames('tb-action-link', 'designerCss', props.className)}
    >
      {schema['x-icon'] && <Icon style={{ marginRight: 8 }} type={schema['x-icon']} />}
      <span>{schema.title || t('Unnamed')}</span>
      <PageTabDesigner schema={schema} />
    </SortableItem>
  );
};

const TabBarExtraContent = (props) => {
  const { hiddenScrollArea, options, theme } = props;
  const dn = useDesignable();
  const { t } = useTranslation();
  const { getAriaLabel } = useGetAriaLabelOfSchemaInitializer();
  const { styles } = useStyles();
  const handleAddTab = async () => {
    const values = await FormDialog(t('Add tab'), () => <AddTabForm options={options} />, theme).open({
      initialValues: {},
    });
    const { title, icon } = values;
    dn.insertBeforeEnd({
      type: 'void',
      title,
      'x-icon': icon,
      'x-component': 'Grid',
      'x-initializer': 'page:addBlock',
      properties: {},
    });
  };

  return (
    <div className={styles.tabWrapper}>
      {dn.designable && (
        <Button
          aria-label={getAriaLabel('tabs')}
          icon={<PlusOutlined />}
          className={'addTabBtn'}
          type={'dashed'}
          onClick={handleAddTab}
        >
          {t('Add tab')}
        </Button>
      )}
      {!hiddenScrollArea && <ScrollArea />}
    </div>
  );
};

const AddTabForm = (props) => {
  const { options } = props;
  const { t } = useTranslation();

  return (
    <SchemaComponentOptions scope={options.scope} components={{ ...options.components }}>
      <FormLayout layout={'vertical'}>
        <SchemaComponent
          schema={{
            properties: {
              title: {
                title: t('Tab name'),
                'x-component': 'Input',
                'x-decorator': 'FormItem',
                required: true,
              },
              icon: {
                title: t('Icon'),
                'x-component': 'IconPicker',
                'x-decorator': 'FormItem',
              },
            },
          }}
        />
      </FormLayout>
    </SchemaComponentOptions>
  );
};

const PageContentComponent = (props) => {
  console.log('%c Line:272 🥥 props', 'font-size:18px;color:#e41a6a;background:#465975', props);
  const handleErrors = (error) => {
    window?.Sentry?.captureException(error);
    console.error(error);
  };

  return (
    <div className="tb-page-wrapper">
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={handleErrors}>
        <PageContent {...props} />
      </ErrorBoundary>
    </div>
  );
};

const PageContent = (props) => {
  const { loading, disablePageHeader, enablePageTabs, fieldSchema, activeKey, height, children } = props;
  const { token } = useToken();

  if (loading) {
    return;
  }
  if (!disablePageHeader && enablePageTabs) {
    return fieldSchema.mapProperties((schema) => {
      if (schema.name !== activeKey) {
        return null;
      }
      return (
        <FixedBlock key={schema.name} height={`calc(${height}px + 46px + ${token.marginLG}px * 2)`}>
          <SchemaComponent
            schema={
              new Schema({
                properties: {
                  [schema.name]: schema,
                },
              })
            }
          />
        </FixedBlock>
      );
    });
  }
  return (
    <FixedBlock height={`calc(${height}px + 46px + ${token.marginLG}px * 2)`}>
      <div className={`pageWithFixedBlockCss tb-page-content`}>{children}</div>
    </FixedBlock>
  );
};
