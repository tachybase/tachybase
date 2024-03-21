import React, { useMemo } from 'react';
import { Cascader } from 'antd';
import { connect, useFieldSchema } from '@formily/react';
import { useCollectionManager, useRequest } from '@nocobase/client';
import _ from 'lodash';

interface Option {
  name: string | number;
  id: string;
  children?: Option[];
}

const AssociationCascader = connect((props) => {
  const fieldSchema = useFieldSchema();
  const collection = fieldSchema['collectionName'];
  const associationField = props.associationField;
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
    const dict = {};
    data?.data.forEach((item) => {
      if (item[associationField]) {
        dict[item[associationField][joinTitleField]] ??= [];
        dict[item[associationField][joinTitleField]].push(item[titleField]);
      }
    });
    const options: Option[] = [];
    _.forEach(dict, (values: any, key) => {
      options.push({
        name: key,
        id: key,
        children: values.map((value) => ({
          name: value,
          id: value,
        })),
      });
    });
    return options;
  }, [associationField, joinTitleField, titleField, data?.data]);
  return <Cascader options={options} {...props} showSearch />;
});

AssociationCascader.displayName = 'AssociationCascader';
export default AssociationCascader;
