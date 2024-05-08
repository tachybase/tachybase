import { CloseCircleFilled } from '@ant-design/icons';
import { css, cx } from '@emotion/css';
import { useForm } from '@tachybase/schema';
import { error } from '@tachybase/utils/client';
import { Input as AntInput, Cascader, DatePicker, InputNumber, Select, Space, Tag } from 'antd';
import useAntdInputStyle from 'antd/es/input/style';
import type { DefaultOptionType } from 'antd/lib/cascader';
import classNames from 'classnames';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCompile } from '../../hooks';
import { XButton } from './XButton';
import { useStyles } from './style';

const JT_VALUE_RE = /^\s*{{\s*([^{}]+)\s*}}\s*$/;

function parseValue(value: any): string | string[] {
  if (value == null) {
    return 'null';
  }
  const type = typeof value;
  if (type === 'string') {
    const matched = value.match(JT_VALUE_RE);
    if (matched) {
      return matched[1].split('.');
    }
    // const ts = Date.parse(value);
    // if (value.match(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d{0,3})Z$/) && !Number.isNaN(Date.parse(value))) {
    //   return {
    //     type: 'date',
    //   };
    // }
  }
  return type === 'object' && value instanceof Date ? 'date' : type;
}

const ConstantTypes = {
  string: {
    label: `{{t("String")}}`,
    value: 'string',
    component: function StringComponent({ onChange, value, ...otherProps }) {
      return <AntInput value={value} onChange={(ev) => onChange(ev.target.value)} {...otherProps} />;
    },
    default: '',
  },
  number: {
    label: '{{t("Number")}}',
    value: 'number',
    component: function NumberComponent({ onChange, value, ...otherProps }) {
      return <InputNumber value={value} onChange={onChange} {...otherProps} />;
    },
    default: 0,
  },
  boolean: {
    label: `{{t("Boolean")}}`,
    value: 'boolean',
    component: function BooleanComponent({ onChange, value, ...otherProps }) {
      const { t } = useTranslation();
      return (
        <Select
          value={value}
          onChange={onChange}
          placeholder={t('Select')}
          options={[
            { value: true, label: t('True') },
            { value: false, label: t('False') },
          ]}
          {...otherProps}
        />
      );
    },
    default: false,
  },
  date: {
    label: '{{t("Date")}}',
    value: 'date',
    component: function DateComponent({ onChange, value, ...otherProps }) {
      return (
        <DatePicker
          value={dayjs(value)}
          onChange={(d) => (d ? onChange(d.toDate()) : null)}
          allowClear={false}
          showTime
          {...otherProps}
        />
      );
    },
    default: (() => {
      const now = new Date();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    })(),
  },
  null: {
    label: `{{t("Null")}}`,
    value: 'null',
    component: function NullComponent() {
      const { t } = useTranslation();
      return <AntInput style={{ width: '100%' }} readOnly placeholder={t('Null')} className="null-value" />;
    },
    default: null,
  },
};

function getTypedConstantOption(type: string, types: true | string[], fieldNames) {
  const allTypes = Object.values(ConstantTypes);
  const children = (
    types ? allTypes.filter((item) => (Array.isArray(types) && types.includes(item.value)) || types === true) : allTypes
  ).map((item) =>
    Object.keys(item).reduce(
      (result, key) =>
        fieldNames[key] in item
          ? result
          : Object.assign(result, {
              [fieldNames[key]]: item[key],
            }),
      item,
    ),
  );
  return {
    value: '',
    label: '{{t("Constant")}}',
    children,
    [fieldNames.value]: '',
    [fieldNames.label]: '{{t("Constant")}}',
    [fieldNames.children]: children,
    component: ConstantTypes[type]?.component,
  };
}

export function Input(props) {
  const {
    value = '',
    onChange,
    children,
    button,
    useTypedConstant,
    style,
    className,
    changeOnSelect,
    fieldNames,
  } = props;
  const scope = typeof props.scope === 'function' ? props.scope() : props.scope;
  const { wrapSSR, hashId, componentCls, rootPrefixCls } = useStyles();

  // 添加 antd input 样式，防止样式缺失
  useAntdInputStyle(`${rootPrefixCls}-input`);

  const compile = useCompile();
  const { t } = useTranslation();
  const form = useForm();
  const [options, setOptions] = React.useState<DefaultOptionType[]>([]);
  const [variableText, setVariableText] = React.useState('');

  const parsed = useMemo(() => parseValue(value), [value]);
  const isConstant = typeof parsed === 'string';
  const type = isConstant ? parsed : '';
  const variable = isConstant ? null : parsed;
  const names = Object.assign(
    {
      label: 'label',
      value: 'value',
      children: 'children',
    },
    fieldNames ?? {},
  );

  const { component: ConstantComponent, ...constantOption }: DefaultOptionType & { component?: React.FC<any> } =
    useMemo(() => {
      if (children) {
        return {
          value: '',
          label: t('Constant'),
          [names.value]: '',
          [names.label]: t('Constant'),
        };
      }
      if (useTypedConstant) {
        return getTypedConstantOption(type, useTypedConstant, names);
      }
      return {
        value: '',
        label: t('Null'),
        [names.value]: '',
        [names.label]: t('Null'),
        component: ConstantTypes.null.component,
      };
    }, [type, useTypedConstant]);

  useEffect(() => {
    setOptions([compile(constantOption), ...(scope ? cloneDeep(scope) : [])]);
  }, [scope]);

  const loadData = async (selectedOptions: DefaultOptionType[]) => {
    const option = selectedOptions[selectedOptions.length - 1];
    if (!option.children?.length && !option.isLeaf && option.loadChildren) {
      await option.loadChildren(option);
      setOptions((prev) => [...prev]);
    }
  };

  const onSwitch = useCallback(
    (next, optionPath: any[]) => {
      if (next[0] === '') {
        if (next[1]) {
          if (next[1] !== type) {
            onChange(ConstantTypes[next[1]]?.default ?? null, optionPath);
          }
        } else {
          if (variable) {
            onChange(null, optionPath);
          }
        }
        return;
      }
      onChange(`{{${next.join('.')}}}`, optionPath);
    },
    [type, variable, onChange],
  );

  useEffect(() => {
    const run = async () => {
      if (!variable || options.length <= 1) {
        return;
      }
      let prevOption: DefaultOptionType = null;
      const labels = [];

      for (let i = 0; i < variable.length; i++) {
        const key = variable[i];
        try {
          if (i === 0) {
            prevOption = options.find((item) => item[names.value] === key);
          } else {
            if (prevOption.loadChildren && !prevOption.children?.length) {
              await prevOption.loadChildren(prevOption);
            }
            prevOption = prevOption.children.find((item) => item[names.value] === key);
          }

          // 如果为空则说明相关字段已被删除
          // fix T-1565
          if (!prevOption) {
            return;
          }

          labels.push(prevOption[names.label]);
        } catch (err) {
          error(err);
        }
      }
      setOptions([...options]);
      setVariableText(labels.join(' / '));
    };

    run();
    // NOTE: watch `options.length` and it only happens once
  }, [variable, options.length]);

  const disabled = props.disabled || form.disabled;

  return wrapSSR(
    <Space.Compact style={style} className={classNames(componentCls, hashId, className)}>
      {variable ? (
        <div
          className={cx(
            'variable',
            css`
              position: relative;
              line-height: 0;

              &:hover {
                .clear-button {
                  display: inline-block;
                }
              }

              .ant-input {
                overflow: auto;
                white-space: nowrap;
                ${disabled ? '' : 'padding-right: 28px;'}

                .ant-tag {
                  display: inline;
                  line-height: 19px;
                  margin: 0;
                  padding: 2px 7px;
                  border-radius: 10px;
                  white-space: nowrap;
                }
              }
            `,
          )}
        >
          <div
            role="button"
            aria-label="variable-tag"
            onInput={(e) => e.preventDefault()}
            onKeyDown={(e) => {
              if (e.key !== 'Backspace') {
                e.preventDefault();
                return;
              }
              onChange(null);
            }}
            className={cx('ant-input', { 'ant-input-disabled': disabled }, hashId)}
            contentEditable={!disabled}
            suppressContentEditableWarning
          >
            <Tag contentEditable={false} color="blue">
              {variableText}
            </Tag>
          </div>
          {!disabled ? (
            <span
              role="button"
              aria-label="icon-close"
              className={cx('clear-button')}
              // eslint-disable-next-line react/no-unknown-property
              unselectable="on"
              onClick={() => onChange(null)}
            >
              <CloseCircleFilled />
            </span>
          ) : null}
        </div>
      ) : (
        <div style={{ flex: 1 }}>
          {children ?? (
            <ConstantComponent role="button" aria-label="variable-constant" value={value} onChange={onChange} />
          )}
        </div>
      )}
      <Cascader
        options={options}
        value={variable ?? ['', ...(children || !constantOption.children?.length ? [] : [type])]}
        onChange={onSwitch}
        loadData={loadData as any}
        changeOnSelect={changeOnSelect}
        fieldNames={fieldNames}
        disabled={disabled}
      >
        {button ?? (
          <XButton
            className={css(`
              margin-left: -1px;
            `)}
            type={variable ? 'primary' : 'default'}
          />
        )}
      </Cascader>
    </Space.Compact>,
  );
}
