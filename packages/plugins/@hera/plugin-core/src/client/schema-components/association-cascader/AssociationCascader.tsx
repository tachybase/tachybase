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
  return <Cascader options={options} {...props} showSearch />;
});

AssociationCascader.displayName = 'AssociationCascader';
export default AssociationCascader;
