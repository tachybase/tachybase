import React, { useMemo } from 'react';
import { Cascader } from 'antd';
import { connect } from '@tachybase/schema';
import { useCollectionManager, useRequest } from '@nocobase/client';
import _ from 'lodash';

const AssociationCascader = connect((props) => {
  const { fieldNames, collection, associationField } = props;
  const cm = useCollectionManager();
  const titleField = cm.getCollection(collection).titleField;
  const joinTitleField = cm.getCollection(collection + '.' + associationField).titleField;

  const params = {
    appends: [associationField],
    fields: [titleField],
    pageSize: 99999,
    filter: props?.params?.filter ? { ...props?.params?.filter } : {},
  };

  const { data } = useRequest<any>({
    resource: collection,
    action: 'list',
    params,
  });

  const options = useMemo(() => {
    if (props.chartCascader) {
      const dataOptions = {};
      const options = [];
      data?.data.forEach((item) => {
        if (item?.[associationField]) {
          const field = [];
          if (Array.isArray(item[associationField]) && item[associationField].length) {
            field.push(...item[associationField]);
          } else {
            field.push({ ...item[associationField] });
          }
          field.forEach((fieldItem) => {
            if (!Object.keys(fieldItem).length) return;
            if (dataOptions[fieldItem[joinTitleField]]) {
              dataOptions[fieldItem[joinTitleField]].push({
                label: item[titleField],
                value: item[titleField],
              });
            } else {
              dataOptions[fieldItem[joinTitleField]] = [
                {
                  label: item[titleField],
                  value: item[titleField],
                },
              ];
            }
          });
        }
      });
      for (const key in dataOptions) {
        options.push({
          label: key,
          value: key,
          children: [...dataOptions[key]],
        });
      }
      return options;
    } else {
      const dict: { [key: string]: string[] } =
        data?.data.reduce((acc, item) => {
          if (item[associationField]) {
            const key = item[associationField][joinTitleField];
            acc[key] ??= [];
            acc[key].push(item[titleField]);
          }
          return acc;
        }, {}) || {};
      const options = Object.entries(dict).map(([key, values]) => ({
        [fieldNames.label]: key,
        [fieldNames.value]: key,
        children: values.map((value) => ({ [fieldNames.label]: value, [fieldNames.value]: value })),
      }));
      return options;
    }
  }, [associationField, joinTitleField, titleField, data?.data]);

  return (
    <SingleValueCascader
      options={options}
      {...props}
      showSearch
      titleField={titleField}
      joinTitleField={joinTitleField}
    />
  );
});

const SingleValueCascader = (props) => {
  const { value, options, onChange, fieldNames, chartCascader, titleField, joinTitleField } = props;
  const fieldLabel = fieldNames ? fieldNames.value : titleField;
  const joinFieldLabel = fieldNames ? fieldNames.value : 'value';
  const arrayValue = value && options ? [] : undefined;
  if (arrayValue) {
    for (const option of options) {
      if (option[fieldLabel] === value) {
        arrayValue.push(option[fieldLabel]);
        break;
      }
      for (const subOption of option.children) {
        if (subOption[joinFieldLabel] === value) {
          arrayValue.push(option[joinFieldLabel]);
          arrayValue.push(subOption[joinFieldLabel]);
          break;
        }
      }
    }
  }
  const newProps = {
    ...props,
    value: arrayValue,
    onChange: (v) => {
      if (v) {
        onChange(v[v.length - 1]);
      } else {
        onChange(v);
      }
    },
  };
  return <Cascader {...newProps} />;
};

SingleValueCascader.displayName = 'SingleValueCascader';
AssociationCascader.displayName = 'AssociationCascader';
export default AssociationCascader;
