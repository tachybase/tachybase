import React, { useMemo } from 'react';
import { observer, useFieldSchema } from '@tachybase/schema';

import { createStyles } from 'antd-style';

import { withDynamicSchemaProps } from '../../application/hoc/withDynamicSchemaProps';
import { FormBlockContext } from '../../block-provider';
import { useCollectionManager_deprecated } from '../../collection-manager';
import { useCollectionParentRecordData } from '../../data-source/collection-record/CollectionRecordProvider';
import { RecordProvider } from '../../record-provider';
import { SchemaComponent, useProps } from '../../schema-component';
import { FilterContext } from '../../schema-component/antd/filter/context';
import { DynamicComponentProps } from '../../schema-component/antd/filter/DynamicComponent';
import { getShouldChange, VariableInput } from '../VariableInput/VariableInput';
import { EnableLinkage } from './components/EnableLinkage';
import { ArrayCollapse } from './components/LinkageHeader';
import { LinkageRuleActionGroup } from './LinkageRuleActionGroup';

interface Props {
  dynamicComponent: any;
}

const useStyles = createStyles(({ css }) => {
  return {
    filter: css`
      position: relative;
      width: 100%;
      margin-left: 10px;
    `,
  };
});

export const FormLinkageRules = withDynamicSchemaProps(
  observer((props: Props) => {
    const { styles } = useStyles();
    const fieldSchema = useFieldSchema();
    const {
      options,
      defaultValues,
      collectionName,
      form,
      formBlockType,
      variables,
      localVariables,
      record,
      dynamicComponent,
    } = useProps(props);
    const { getAllCollectionsInheritChain } = useCollectionManager_deprecated();
    const parentRecordData = useCollectionParentRecordData();

    const components = useMemo(() => ({ ArrayCollapse }), []);
    const schema = useMemo(
      () => ({
        type: 'object',
        properties: {
          rules: {
            type: 'array',
            default: defaultValues,
            'x-component': 'ArrayCollapse',
            'x-decorator': 'FormItem',
            'x-component-props': {
              accordion: true,
            },
            items: {
              type: 'object',
              'x-component': 'ArrayCollapse.CollapsePanel',
              'x-component-props': {
                extra: <EnableLinkage />,
              },
              properties: {
                layout: {
                  type: 'void',
                  'x-component': 'FormLayout',
                  'x-component-props': {
                    labelStyle: {
                      marginTop: '6px',
                    },
                    labelCol: 8,
                    wrapperCol: 16,
                  },
                  properties: {
                    conditions: {
                      'x-component': 'h4',
                      'x-content': '{{ t("Condition") }}',
                    },
                    condition: {
                      'x-component': 'Filter',
                      'x-use-component-props': () => {
                        return {
                          options,
                          className: styles.filter,
                        };
                      },
                      'x-component-props': {
                        collectionName,
                        dynamicComponent: (props: DynamicComponentProps) => {
                          const { collectionField } = props;
                          return (
                            <VariableInput
                              {...props}
                              form={form}
                              record={record}
                              shouldChange={getShouldChange({
                                collectionField,
                                variables,
                                localVariables,
                                getAllCollectionsInheritChain,
                              })}
                            />
                          );
                        },
                      },
                    },
                    actions: {
                      'x-component': 'h4',
                      'x-content': '{{ t("Properties") }}',
                    },
                    action: {
                      type: 'void',
                      'x-component': LinkageRuleActionGroup,
                      'x-component-props': {
                        ...props,
                      },
                    },
                  },
                },
                remove: {
                  type: 'void',
                  'x-component': 'ArrayCollapse.Remove',
                },
                moveUp: {
                  type: 'void',
                  'x-component': 'ArrayCollapse.MoveUp',
                },
                moveDown: {
                  type: 'void',
                  'x-component': 'ArrayCollapse.MoveDown',
                },
                copy: {
                  type: 'void',
                  'x-component': 'ArrayCollapse.Copy',
                },
              },
            },
            properties: {
              add: {
                type: 'void',
                title: '{{ t("Add linkage rule") }}',
                'x-component': 'ArrayCollapse.Addition',
                'x-reactions': {
                  dependencies: ['rules'],
                  fulfill: {
                    state: {
                      // disabled: '{{$deps[0].length >= 3}}',
                    },
                  },
                },
              },
            },
          },
        },
      }),
      [collectionName, defaultValues, form, localVariables, options, props, record, variables],
    );
    const value = useMemo(
      () => ({ field: options, fieldSchema, dynamicComponent, options: options || [] }),
      [dynamicComponent, fieldSchema, options],
    );

    return (
      <FormBlockContext.Provider value={{ form, type: formBlockType, collectionName }}>
        <RecordProvider record={record} parent={parentRecordData}>
          <FilterContext.Provider value={value}>
            <SchemaComponent components={components} schema={schema} />
          </FilterContext.Provider>
        </RecordProvider>
      </FormBlockContext.Provider>
    );
  }),
  { displayName: 'FormLinkageRules' },
);
