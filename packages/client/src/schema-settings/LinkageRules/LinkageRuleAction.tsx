import React, { useCallback, useContext, useMemo, useState } from 'react';
import { TreeSelect } from '@tachybase/components';
import { observer, uid } from '@tachybase/schema';

import { CloseCircleOutlined } from '@ant-design/icons';
import { Select, Space } from 'antd';
import { createStyles } from 'antd-style';
import { useTranslation } from 'react-i18next';

import { useCompile } from '../..';
import { LinkageLogicContext, RemoveActionContext } from './context';
import { DynamicComponent } from './DynamicComponent';
import { ActionType } from './type';
import { useValues } from './useValues';
import { ValueDynamicComponent } from './ValueDynamicComponent';

const useStyles = createStyles(({ css }) => {
  return {
    container: css`
      .ant-space {
        display: inline-block;
      }
    `,
    item: css`
      .ant-space {
        display: inline-block;
      }
      .ant-space-item {
        max-width: 95%;
        display: inline-block;
        margin: 2px;
        vertical-align: top;
      }
    `,
    select: css`
      min-width: 120px;
    `,
    tree: css`
      min-width: 160px;
    `,
  };
});

export const FormFieldLinkageRuleAction = observer(
  (props: any) => {
    const { value, options, collectionName } = props;
    const { styles } = useStyles();
    const { t } = useTranslation();
    const compile = useCompile();
    const remove = useContext(RemoveActionContext);
    const {
      schema,
      fields,
      operator,
      setDataIndex,
      setOperator,
      setValue,
      value: fieldValue,
      operators,
    } = useValues(options);
    return (
      <LinkageLogicContext.Provider value={uid()}>
        <div style={{ marginBottom: 8 }} className={styles.container}>
          <Space className={styles.item}>
            <TreeSelect
              // @ts-ignore
              role="button"
              data-testid="select-linkage-property-field"
              className={styles.tree}
              fieldNames={{
                label: 'title',
                value: 'name',
                children: 'children',
              }}
              treeCheckable={true}
              value={value?.targetFields}
              multiple
              allowClear
              treeData={compile(fields)}
              onChange={(value) => {
                setDataIndex(value);
              }}
              placeholder={t('Select field')}
            />
            <Select
              // @ts-ignore
              role="button"
              data-testid="select-linkage-action-field"
              popupMatchSelectWidth={false}
              value={operator}
              className={styles.select}
              options={compile(operators)}
              onChange={(value) => {
                setOperator(value);
              }}
              placeholder={t('action')}
            />
            {[ActionType.Value].includes(operator) && (
              <ValueDynamicComponent
                fieldValue={fieldValue}
                schema={schema}
                setValue={setValue}
                collectionName={collectionName}
              />
            )}
            {!props.disabled && (
              <a role="button" aria-label="icon-close">
                <CloseCircleOutlined onClick={() => remove()} style={{ color: '#bfbfbf' }} />
              </a>
            )}
          </Space>
        </div>
      </LinkageLogicContext.Provider>
    );
  },
  { displayName: 'FormFieldLinkageRuleAction' },
);

export const FormButtonLinkageRuleAction = observer(
  (props: any) => {
    const { value, options } = props;
    const { t } = useTranslation();
    const compile = useCompile();
    const [editFlag, setEditFlag] = useState(false);
    const remove = useContext(RemoveActionContext);
    const { schema, operator, setOperator, setValue } = useValues(options);
    const operators = useMemo(
      () =>
        compile([
          { label: t('Visible'), value: ActionType.Visible, schema: {} },
          { label: t('Hidden'), value: ActionType.Hidden, schema: {} },
          { label: t('Disabled'), value: ActionType.Disabled, schema: {} },
          { label: t('Enabled'), value: ActionType.Active, schema: {} },
        ]),
      [compile, t],
    );

    const onChange = useCallback(
      (value) => {
        const flag = [ActionType.Value].includes(value);
        setEditFlag(flag);
        setOperator(value);
      },
      [setOperator],
    );

    const onChangeValue = useCallback(
      (value) => {
        setValue(value);
      },
      [setValue],
    );

    const closeStyle = useMemo(() => ({ color: '#bfbfbf' }), []);

    return (
      <div style={{ marginBottom: 8 }}>
        <Space>
          <Select
            data-testid="select-linkage-properties"
            popupMatchSelectWidth={false}
            value={operator}
            options={operators}
            onChange={onChange}
            placeholder={t('action')}
          />
          {editFlag &&
            React.createElement(DynamicComponent, {
              value,
              schema,
              onChange: onChangeValue,
            })}
          {!props.disabled && (
            <a role="button" aria-label="icon-close">
              <CloseCircleOutlined onClick={remove} style={closeStyle} />
            </a>
          )}
        </Space>
      </div>
    );
  },
  { displayName: 'FormButtonLinkageRuleAction' },
);
