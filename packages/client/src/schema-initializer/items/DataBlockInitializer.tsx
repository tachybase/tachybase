import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrayTable } from '@tachybase/components';
import { ISchema, uid, useField, useForm } from '@tachybase/schema';

import { TableOutlined } from '@ant-design/icons';
import { Divider, Empty, Input, MenuProps, Spin } from 'antd';
import { cloneDeep } from 'lodash';
import { useTranslation } from 'react-i18next';

import { useAPIClient, useRequest } from '../../api-client';
import {
  SchemaInitializerItem,
  SchemaInitializerMenu,
  useGetSchemaInitializerMenuItems,
  useSchemaInitializer,
} from '../../application';
import { TemplateSummary, useCancelAction, useCollectionManager_deprecated } from '../../collection-manager';
import * as components from '../../collection-manager/Configuration/components';
import { DataSource } from '../../data-source';
import { Collection, CollectionFieldOptions } from '../../data-source/collection/Collection';
import { Icon } from '../../icon';
import { ActionContextProvider, SchemaComponent, useActionContext, useCompile } from '../../schema-component';
import { useSchemaTemplateManager } from '../../schema-templates';
import { useCollectionDataSourceItems } from '../utils';

const MENU_ITEM_HEIGHT = 40;
const STEP = 15;

export const SearchCollections = ({ value: outValue, onChange }) => {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>(outValue);
  const inputRef = React.useRef<any>(null);

  // 之所以要增加个内部的 value 是为了防止用户输入过快时造成卡顿的问题
  useEffect(() => {
    setValue(outValue);
  }, [outValue]);

  // TODO: antd 的 Input 的 autoFocus 有 BUG，会不生效，等待官方修复后再简化：https://github.com/ant-design/ant-design/issues/41239
  useEffect(() => {
    // 1. 组件在第一次渲染时自动 focus，提高用户体验
    inputRef.current.input.focus();

    // 2. 当组件已经渲染，并再次显示时，自动 focus
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        inputRef.current.input.focus();
      }
    });

    observer.observe(inputRef.current.input);
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ width: 210 }} onClick={(e) => e.stopPropagation()}>
      <Input
        ref={inputRef}
        allowClear
        style={{ padding: '0 4px 6px', boxShadow: 'none' }}
        bordered={false}
        placeholder={t('Search and select collection')}
        value={value}
        onClick={(e) => {
          e.stopPropagation();
        }}
        onChange={(e) => {
          onChange(e.target.value);
          setValue(e.target.value);
        }}
      />
      <Divider style={{ margin: 0 }} />
    </div>
  );
};

const LoadingItem = ({ loadMore, maxHeight }) => {
  const spinRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = spinRef.current;
    if (!el) return;

    let container = el.parentElement;
    while (container && container.tagName !== 'UL') {
      container = container.parentElement;
    }

    const checkLoadMore = function () {
      if (!container) return;
      // 判断滚动是否到达底部
      if (Math.abs(container.scrollHeight - container.scrollTop - container.clientHeight) <= MENU_ITEM_HEIGHT) {
        // 到达底部，执行加载更多的操作
        loadMore();
      }
    };

    // 监听滚动，滚动到底部触发加载更多
    if (container) {
      container.style.height = `${maxHeight - MENU_ITEM_HEIGHT}px`;
      container.style.maxHeight = 'inherit';
      container.style.overflowY = 'scroll';
      container.addEventListener('scroll', checkLoadMore);
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', checkLoadMore);
        delete container.style.height;
      }
    };
  }, [loadMore, maxHeight]);

  return (
    <div ref={spinRef} onClick={(e) => e.stopPropagation()}>
      <Spin size="small" style={{ width: '100%' }} />
    </div>
  );
};

export function useMenuSearch({
  data,
  openKeys,
  showType,
  hideSearch,
}: {
  data: any[];
  openKeys: string[];
  showType?: boolean;
  hideSearch?: boolean;
}) {
  const [searchValue, setSearchValue] = useState('');
  const [count, setCount] = useState(STEP);

  const isMuliSource = useMemo(() => data.length > 1, [data]);
  const openKey = useMemo(() => {
    return isMuliSource ? openKeys?.[1] : openKeys?.length > 0;
  }, [openKeys]);

  useEffect(() => {
    if (!openKey) {
      setSearchValue('');
    }
  }, [openKey]);

  const currentItems = useMemo(() => {
    if (isMuliSource) {
      if (!openKey) return [];
      return data.find((item) => (item.key || item.name) === openKey)?.children || [];
    }
    return data[0]?.children || [];
  }, [data, isMuliSource, openKey]);

  // 根据搜索的值进行处理
  const searchedItems = useMemo(() => {
    if (!searchValue) return currentItems;
    const lowerSearchValue = searchValue.toLocaleLowerCase();
    return currentItems.filter(
      (item) =>
        (item.label || item.title) &&
        String(item.label || item.title)
          .toLocaleLowerCase()
          .includes(lowerSearchValue),
    );
  }, [searchValue, currentItems]);

  const shouldLoadMore = useMemo(() => searchedItems.length > count, [count, searchedItems]);

  // 根据 count 进行懒加载处理
  const limitedSearchedItems = useMemo(() => {
    return searchedItems.slice(0, count);
  }, [searchedItems, count]);

  // 最终的返回结果
  const resultItems = useMemo<MenuProps['items']>(() => {
    const res = [];
    if (!hideSearch) {
      // 开头：搜索框
      res.push(
        Object.assign(
          {
            key: 'search',
            label: (
              <SearchCollections
                value={searchValue}
                onChange={(val: string) => {
                  setCount(STEP);
                  setSearchValue(val);
                }}
              />
            ),
            onClick({ domEvent }) {
              domEvent.stopPropagation();
            },
          },
          // isMenuType 为了 `useSchemaInitializerMenuItems()` 里面处理判断标识的
          showType ? { isMenuType: true } : {},
        ),
      );
    }

    // 中间：搜索的数据
    if (limitedSearchedItems.length > 0) {
      // 有搜索结果
      res.push(...limitedSearchedItems);
      if (shouldLoadMore) {
        res.push(
          Object.assign(
            {
              key: 'load-more',
              label: (
                <LoadingItem
                  maxHeight={STEP * MENU_ITEM_HEIGHT}
                  loadMore={() => {
                    setCount((count) => count + STEP);
                  }}
                />
              ),
            },
            showType ? { isMenuType: true } : {},
          ),
        );
      }
    } else {
      // 搜索结果为空
      res.push(
        Object.assign(
          {
            key: 'empty',
            style: {
              height: 150,
            },
            label: (
              <div onClick={(e) => e.stopPropagation()}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ),
          },
          showType ? { isMenuType: true } : {},
        ),
      );
    }

    return res;
  }, [hideSearch, limitedSearchedItems, searchValue, shouldLoadMore, showType]);

  const res = useMemo(() => {
    if (!isMuliSource) return resultItems;
    return data.map((item) => {
      if (openKey && item.key === openKey) {
        return {
          ...item,
          children: resultItems,
        };
      } else {
        return {
          ...item,
          children: [],
        };
      }
    });
  }, [data, isMuliSource, openKey, resultItems]);
  return res;
}

export interface DataBlockInitializerProps {
  templateWrap?: (
    templateSchema: any,
    {
      item,
      fromOthersInPopup,
    }: {
      item: any;
      fromOthersInPopup?: boolean;
    },
  ) => any;
  onCreateBlockSchema?: (args: any) => void;
  createBlockSchema?: (args: any) => any;
  icon?: string | React.ReactNode;
  name: string;
  title: string;
  filter?: (options: { collection: Collection; associationField: CollectionFieldOptions }) => boolean;
  filterDataSource?: (dataSource: DataSource) => boolean;
  componentType: string;
  onlyCurrentDataSource?: boolean;
  hideSearch?: boolean;
  showAssociationFields?: boolean;
  /** 如果只有一项数据表时，不显示 children 列表 */
  hideChildrenIfSingleCollection?: boolean;
  items?: ReturnType<typeof useCollectionDataSourceItems>[];
  /**
   * 是否是点击弹窗中的 Others 选项进入的
   */
  fromOthersInPopup?: boolean;
  /**
   * 隐藏弹窗中的 Other records 选项
   */
  hideOtherRecordsInPopup?: boolean;
}

export const DataBlockInitializer = (props: DataBlockInitializerProps) => {
  const {
    templateWrap,
    onCreateBlockSchema,
    componentType,
    icon = TableOutlined,
    name,
    title,
    filter,
    onlyCurrentDataSource,
    hideSearch,
    showAssociationFields,
    hideChildrenIfSingleCollection,
    filterDataSource,
    items: itemsFromProps,
    fromOthersInPopup,
    hideOtherRecordsInPopup,
  } = props;
  const { insert, setVisible } = useSchemaInitializer();
  const compile = useCompile();
  const { getTemplateSchemaByMode } = useSchemaTemplateManager();
  const { getTemplate, templates: collectionTemplates } = useCollectionManager_deprecated();
  const [schema, setSchema] = useState({});
  const [schemaVisible, setSchemaVisible] = useState(false);
  const onClick = useCallback(
    async ({ item }) => {
      if (item.template) {
        console.log('%c Line:331 🍞 item.template', 'font-size:18px;color:#ed9ec7;background:#93c0a4', item.template);
        const s = await getTemplateSchemaByMode(item);
        templateWrap ? insert(templateWrap(s, { item, fromOthersInPopup })) : insert(s);
      } else {
        if (onCreateBlockSchema) {
          onCreateBlockSchema({ item, fromOthersInPopup });
        }
      }
      setVisible(false);
    },
    [fromOthersInPopup, getTemplateSchemaByMode, insert, onCreateBlockSchema, setVisible, templateWrap],
  );
  const items =
    itemsFromProps ||
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useCollectionDataSourceItems({
      componentName: componentType,
      filter,
      filterDataSource,
      onlyCurrentDataSource,
      showAssociationFields,
      dataBlockInitializerProps: props,
      hideOtherRecordsInPopup,
    });

  const getMenuItems = useGetSchemaInitializerMenuItems(onClick);
  const childItems = useMemo(() => {
    return getMenuItems(items, name);
  }, [getMenuItems, items, name]);
  const [openMenuKeys, setOpenMenuKeys] = useState([]);
  const { t } = useTranslation();
  const searchedChildren = useMenuSearch({ data: childItems, openKeys: openMenuKeys, hideSearch });
  const useCreateCollection = (schema?: any) => {
    const api = useAPIClient();
    const form = useForm();
    const { refreshCM } = useCollectionManager_deprecated();
    const ctx = useActionContext();
    const field = useField();
    return {
      async run() {
        field.data = field.data || {};
        field.data.loading = true;
        try {
          await form.submit();
          const values = cloneDeep(form.values);
          if (schema?.events?.beforeSubmit) {
            schema.events.beforeSubmit(values);
          }
          if (!values.autoCreateReverseField) {
            delete values.reverseField;
          }
          delete values.autoCreateReverseField;
          await api.resource('collections').create({
            values: {
              logging: true,
              ...values,
            },
          });
          ctx.setVisible(false);
          if (onCreateBlockSchema) {
            onCreateBlockSchema({
              item: { name: values.name, dataSource: 'main', title: values.title },
              fromOthersInPopup,
            });
          }
          await form.reset();
          field.data.loading = false;
          await refreshCM();
        } catch (error) {
          field.data.loading = false;
        }
      },
    };
  };
  const collectionItems = useMemo(() => {
    const result = [];
    collectionTemplates.forEach((item) => {
      if (item.divider) {
        result.push({
          type: 'divider',
        });
      }
      if (item.name === 'import') {
        return;
      }
      if (item.name === 'importXlsx') {
        return;
      }
      result.push({
        label: compile(item.title),
        key: item.name,
        onClick: (info) => {
          const schema = getSchema(getTemplate(info.key), compile, useCreateCollection);
          setSchema(schema);
          setVisible(false);
          setSchemaVisible(true);
        },
      });
    });
    return result;
  }, [collectionTemplates]);
  const compiledMenuItems = useMemo(() => {
    let children = searchedChildren.filter((item) => item.key !== 'search' && item.key !== 'empty');
    if (hideChildrenIfSingleCollection && children.length === 1) {
      // 只有一项可选时，直接展开
      children = children[0].children;
    } else {
      children = searchedChildren;
    }
    if (name === 'form') {
      children = [
        ...children,
        {
          key: 'create-collection',
          label: t('Create collection'),
          children: collectionItems,
        },
      ];
    }
    return [
      {
        key: name,
        label: compile(title),
        icon: typeof icon === 'string' ? <Icon type={icon as string} /> : (icon as React.ReactNode),
        onClick: (info) => {
          if (info.key !== name) return;
          onClick({ ...info, item: props });
        },
        children,
      },
    ];
  }, [searchedChildren, hideChildrenIfSingleCollection, name, compile, title, icon, onClick, props]);

  if (childItems.length > 1 || (childItems.length === 1 && childItems[0].children?.length > 0)) {
    return (
      <div>
        <SchemaInitializerMenu
          onOpenChange={(keys) => {
            setOpenMenuKeys(keys);
          }}
          items={compiledMenuItems}
        />
        <ActionContextProvider value={{ visible: schemaVisible, setVisible: setSchemaVisible }}>
          <SchemaComponent
            schema={schema}
            components={{ ...components, ArrayTable, TemplateSummay: TemplateSummary }}
            scope={{
              useCancelAction,
              createOnly: true,
              useCreateCollection,
              showReverseFieldConfig: true,
            }}
          />
        </ActionContextProvider>
      </div>
    );
  }

  return <SchemaInitializerItem {...props} onClick={onClick} />;
};

const getSchema = (schema, compile, useCreateCollection): ISchema => {
  if (!schema) {
    return;
  }

  const properties = cloneDeep(schema.configurableProperties) as any;

  if (schema.hasDefaultValue === true) {
    properties['defaultValue'] = cloneDeep(schema.default.uiSchema);
    properties['defaultValue']['title'] = compile('{{ t("Default value") }}');
    properties['defaultValue']['x-decorator'] = 'FormItem';
  }
  const initialValue: any = {
    name: `t_${uid()}`,
    template: schema.name,
    view: schema.name === 'view',
    ...cloneDeep(schema.default),
  };
  if (initialValue.reverseField) {
    initialValue.reverseField.name = `f_${uid()}`;
  }
  return {
    type: 'object',
    properties: {
      [uid()]: {
        type: 'void',
        'x-component': 'Action.Drawer',
        'x-component-props': {
          // getContainer: '{{ getContainer }}',
        },
        'x-decorator': 'Form',
        'x-decorator-props': {
          useValues(options) {
            return useRequest(
              () =>
                Promise.resolve({
                  data: initialValue,
                }),
              options,
            );
          },
        },
        title: '{{ t("Create collection") }}',
        properties: {
          summary: {
            type: 'void',
            'x-component': 'TemplateSummay',
            'x-component-props': {
              schemaKey: schema.name,
            },
          },
          // @ts-ignore
          ...properties,
          footer: {
            type: 'void',
            'x-component': 'Action.Drawer.Footer',
            properties: {
              action1: {
                title: '{{ t("Cancel") }}',
                'x-component': 'Action',
                'x-component-props': {
                  useAction: '{{ useCancelAction }}',
                },
              },
              action2: {
                title: '{{ t("Submit") }}',
                'x-component': 'Action',
                'x-component-props': {
                  type: 'primary',
                  useAction: () => useCreateCollection(schema),
                },
              },
            },
          },
        },
      },
    },
  };
};
