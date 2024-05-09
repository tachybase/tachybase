import {
  CollectionFieldOptions_deprecated,
  CollectionManager,
  FieldOptions,
  InheritanceCollectionMixin,
  SchemaInitializerChildren,
  SchemaInitializerItemType,
  isAssocField,
  useCollection,
  useCollectionManager,
  useDataSource,
  useDataSourceManager,
} from '@tachybase/client';
import React, { useCallback } from 'react';
import { tval } from '../../../../../locale';
import { canBeDataField, canBeOptionalField, canBeRelatedField, canBeSearchField } from '../utils';
import { useIsMobile } from '../components/field-item/hooks';

interface ItemInterface {
  field: FieldOptions;
  label: string;
  schemaName: string;
  collectionName: string;
  getCollectionFields;
  processedCollections: string[];
  collectionManager: CollectionManager;
  currentCollection?: string;
}

export const TabSearchAssociatedFields = () => {
  // NOTE: 这里的 useAssociationFields 借鉴的是 useFilterAssociatedFormItemInitializerFields
  const associationFieldsText = useAssociationFields('textField');
  const associationFieldsChoice = useAssociationFields('choiceField');
  // 这里的 children, 后续实际不是用来渲染的,  是个普通的 props 字段
  // XXX: refactor, 不好的设计, 用 children 来做普通 props 的数据传递
  const children: any[] = [
    {
      type: 'itemGroup',
      title: tval('Display association Textfields', false),
      children: associationFieldsText,
    },
    {
      type: 'itemGroup',
      title: tval('Display association Choicefields', false),
      children: associationFieldsChoice,
    },
  ];

  return <SchemaInitializerChildren>{children}</SchemaInitializerChildren>;
};

function useAssociationFields(type: 'textField' | 'choiceField') {
  const collection = useCollection<{ allFields: FieldOptions[] }>();

  const { name, allFields } = collection || {};

  const { getCollectionFields } = useCollectionFields_custom();
  const isMobile = useIsMobile();

  const cm = useCollectionManager();

  const filteredAssociationFields = allFields?.filter(({ interface: _interface }) => {
    return canBeRelatedField(_interface);
  });

  const paramsItem = {
    collectionName: name,
    getCollectionFields,
    processedCollections: [],
    collectionManager: cm,
  };

  let mappedAssociationFields = [];
  if (type === 'textField') {
    mappedAssociationFields = filteredAssociationFields.map((field) => {
      // 将关联表字段转换为 schema 树
      const label = canBeRelatedField(field.interface)
        ? cm.getCollection(`${name}.${field.name}`)?.titleField
        : field.name;

      const result = getItemInput(
        {
          ...paramsItem,
          field,
          label,
          schemaName: field.name,
        },
        isMobile,
      );
      return result;
    });
  } else if (type === 'choiceField') {
    mappedAssociationFields = filteredAssociationFields.map((field) => {
      // 将关联表字段转换为 schema 树
      const label = cm.getCollection(field.target)?.getPrimaryKey() || 'id';
      const result = getItemChoice(
        {
          ...paramsItem,
          field,
          label,
          schemaName: field.name,
        },
        isMobile,
      );
      return result;
    });
  }

  const associationFields = mappedAssociationFields.filter(Boolean);
  return associationFields;
}

// NOTE: 递归生成 schema 树
function getItemInput(params: ItemInterface, isMobile?: boolean) {
  const {
    field,
    label,
    schemaName,
    collectionName,
    getCollectionFields,
    processedCollections,
    collectionManager: cm,
  } = params;
  const { interface: _interface } = field;
  const isCanBeOptional = canBeOptionalField(_interface);
  const isCanBeRelated = canBeRelatedField(_interface);

  // NOTE: 目前只支持 m2o 和 obo 关联
  if (['m2o', 'obo'].includes(_interface)) {
    if (processedCollections.includes(field.target)) return null;
    const subFields = getCollectionFields(field.target);
    return {
      type: 'subMenu',
      name: field.uiSchema?.title,
      title: field.uiSchema?.title,
      // 将所有的关联字段排在最后
      children: subFields
        .toSorted((a, b) => +Object.hasOwn(a, 'target') - +Object.hasOwn(b, 'target'))
        .map((subField) => {
          const label = canBeRelatedField(field.interface)
            ? cm.getCollection(`${name}.${field.name}`)?.titleField
            : field.name;
          return getItemInput(
            {
              field: subField,
              label,
              schemaName: `${schemaName}.${subField.name}`,
              collectionName: collectionName,
              getCollectionFields: getCollectionFields,
              processedCollections: [...processedCollections, field.target],
              collectionManager: cm,
            },
            isMobile,
          );
        })
        .filter(Boolean),
    } as SchemaInitializerItemType;
  }
  // 然后排除其他类型的关联字段
  if (isAssocField(field)) return null;

  if (!(canBeSearchField(_interface) && !canBeRelatedField(_interface) && !canBeDataField(_interface))) {
    return null;
  }

  // 制造 schema
  // const schema = ;

  // {
  //   type: 'itemGroup',
  //   name: 'textFields',
  //   title: tval('Text fields'),
  //   useChildren: useChildrenTextField,
  // },
  // {
  //   type: 'itemGroup',
  //   name: 'choicesFields',
  //   title: tval('Choices fields'),
  //   useChildren: useChildrenChoiceField,
  // },

  return {
    // type: 'item',
    name: field.uiSchema?.title || field.name,
    title: field.uiSchema?.title || field.name,
    Component: 'TabSearchFieldSchemaInitializerGadget',
    // remove: removeGridFormItem,
    schema: {
      // type: 'string',
      type: 'void',
      name: schemaName,
      title: `${field.uiSchema?.title}`,
      fieldName: `${schemaName}`,
      // 'x-designer': 'FormItem.FilterFormDesigner',
      // 'x-designer-props': {
      //   // 在 useOperatorList 中使用，用于获取对应的操作符列表
      //   interface: field.interface,
      // },
      'x-toolbar': 'CollapseItemSchemaToolbar',
      'x-settings': 'fieldSettings:TabSearchItem',
      'x-collection-field': `${collectionName}.${schemaName}`,
      // 'x-decorator': 'FormItem',
      // 'x-component': 'CollectionField',
      'x-component': matchTruthValue({
        ['TabSearchCollapsibleInputMItem']: isMobile,
        ['TabSearchCollapsibleInputItem']: !isMobile,
      }),
      'x-component-props': {
        fieldNames: {
          label,
        },
        interface: field.interface,
        collectionName: collectionName,
        correlation: field.name,
      },
      'x-use-component-props': matchTruthValue({
        ['useTabSearchFieldItemProps']: isCanBeOptional,
        ['useTabSearchFieldItemRelatedProps']: isCanBeRelated,
      }),

      // 'x-read-pretty': false,
    },
  } as SchemaInitializerItemType;
}
// NOTE: 递归生成 schema 树
function getItemChoice(params: ItemInterface, isMobile?: boolean) {
  const {
    field,
    label,
    schemaName,
    collectionName,
    getCollectionFields,
    processedCollections,
    collectionManager: cm,
    currentCollection,
  } = params;

  const { interface: _interface } = field;
  const isCanBeOptional = canBeOptionalField(_interface);
  const isCanBeRelated = canBeRelatedField(_interface);

  // NOTE: 目前只支持 m2o 和 obo 关联
  if (['m2o', 'obo'].includes(_interface) && !field.choiceTag) {
    if (processedCollections.includes(field.target)) return null;
    const subFields = getCollectionFields(field.target);
    return {
      type: 'subMenu',
      name: field.uiSchema?.title,
      title: field.uiSchema?.title,
      // 将所有的关联字段排在最后
      children: subFields
        .reduce((acc, subField) => {
          if (Object.hasOwn(subField, 'target') && ['m2o', 'obo'].includes(subField.interface)) {
            // NOTE: 将当前的关联字段复制一份, 作为当前层级的选择展示,并打上选择标记 choiceTag
            acc.push({
              ...subField,
              choiceTag: true,
            });
          }
          return [...acc, subField];
        }, [])
        // NOTE: 排序规则: 1. 关联字段放最后 2. 选择复制字段次之 3. 其他字段置前
        .toSorted(
          (a, b) =>
            +Object.hasOwn(a, 'target') * 2 -
            +Object.hasOwn(a, 'choiceTag') -
            +Object.hasOwn(b, 'target') * 2 -
            +Object.hasOwn(b, 'choiceTag'),
        )
        .map((subField) => {
          const label = cm.getCollection(field.target)?.getPrimaryKey() || 'id';
          return getItemChoice(
            {
              field: subField,
              label,
              schemaName: `${schemaName}.${subField.name}`,
              collectionName: collectionName,
              getCollectionFields: getCollectionFields,
              processedCollections: [...processedCollections, field.target],
              collectionManager: cm,
              currentCollection: field.target,
            },
            isMobile,
          );
        })
        .filter(Boolean),
    } as SchemaInitializerItemType;
  }

  // 然后排除其他类型的关联字段, 并且不要删除打上选择标记 choiceTag 的关联字段
  if (isAssocField(field) && !field.choiceTag) return null;

  if (!canBeOptionalField(_interface) && !canBeRelatedField(_interface)) {
    return null;
  }

  return {
    type: 'item',
    name: field.uiSchema?.title || field.name,
    title: field.uiSchema?.title || field.name,
    Component: 'TabSearchFieldSchemaInitializerGadget',
    // remove: removeGridFormItem,
    schema: {
      // type: 'string',
      type: 'void',
      name: schemaName,
      title: `${field.uiSchema?.title}`,
      fieldName: `${schemaName}`,
      // 'x-designer': 'FormItem.FilterFormDesigner',
      // 'x-designer-props': {
      //   // 在 useOperatorList 中使用，用于获取对应的操作符列表
      //   interface: field.interface,
      // },
      'x-toolbar': 'CollapseItemSchemaToolbar',
      'x-settings': 'fieldSettings:TabSearchItem',
      // 'x-read-pretty': false,
      'x-collection-field': `${collectionName}.${schemaName}`,
      // 'x-decorator': 'FormItem',
      // 'x-component': 'CollectionField',
      'x-component': matchTruthValue({
        ['TabSearchFieldMItem']: isMobile,
        ['TabSearchFieldItem']: !isMobile,
      }),
      'x-component-props': {
        fieldNames: {
          label,
        },
        interface: field.interface,
        collectionName: collectionName,
        correlation: field.name,
        currentCollection,
      },
      'x-use-component-props': matchTruthValue({
        ['useTabSearchFieldItemProps']: isCanBeOptional,
        ['useTabSearchFieldItemRelatedProps']: isCanBeRelated,
      }),
    },
  } as SchemaInitializerItemType;
}

// XXX: 为了不使用标记废弃的 api, 模拟复制原方法实现; 参考 useCollectionManager_deprecated
function useCollectionFields_custom(dataSourceName?: string) {
  const dm = useDataSourceManager();
  const cm = useCollectionManager();
  const dataSource = useDataSource();
  const dataSourceNameValue = dataSourceName || dataSource?.key || undefined;

  const getCm = useCallback(
    (dataSource?: string) => {
      if (cm && !dataSource) {
        return cm;
      } else {
        return dm?.getDataSource(dataSource || dataSourceNameValue)?.collectionManager;
      }
    },
    [cm, dm, dataSourceNameValue],
  );

  const getCollectionFields = useCallback(
    (name: any, customDataSource?: string): CollectionFieldOptions_deprecated[] => {
      if (!name) return [];
      const collection = getCm(customDataSource)?.getCollection<InheritanceCollectionMixin>(name);
      return collection?.getAllFields?.() || collection?.getFields() || [];
    },
    [dm, getCm],
  );

  return {
    getCollectionFields,
  };
}

function matchTruthValue(obj: Record<string, boolean>): string {
  const result = Object.entries(obj).find(([, value]) => value);
  const [key] = result || [];
  return key;
}
