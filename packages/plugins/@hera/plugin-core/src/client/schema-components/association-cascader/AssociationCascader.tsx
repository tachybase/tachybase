import React, { useMemo } from 'react';
import { Cascader } from 'antd';
import { connect } from '@formily/react';
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
  }, [associationField, joinTitleField, titleField, data?.data]);
  return <SingleValueCascader options={options} {...props} showSearch />;
});

const SingleValueCascader = (props) => {
  const { value, options, onChange, fieldNames } = props;
  const arrayValue = value && options ? [] : undefined;
  if (arrayValue) {
    for (const option of options) {
      if (option[fieldNames.value] === value) {
        arrayValue.push(option[fieldNames.value]);
        break;
      }
      for (const subOption of option.children) {
        if (subOption[fieldNames.value] === value) {
          arrayValue.push(option[fieldNames.value]);
          arrayValue.push(subOption[fieldNames.value]);
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
