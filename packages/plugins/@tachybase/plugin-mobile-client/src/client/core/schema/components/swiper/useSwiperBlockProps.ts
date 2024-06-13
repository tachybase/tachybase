import React, { useEffect } from 'react';
import { useCollection, useDesignable, useRequest } from '@tachybase/client';
import { useFieldSchema } from '@tachybase/schema';

import { useNavigate } from 'react-router-dom';

export const useSwiperBlockProps = () => {
  const fieldSchema = useFieldSchema();
  const navigate = useNavigate();
  const properties = fieldSchema.properties ? Object.values(fieldSchema.properties) : null;
  const { insertAdjacent } = useDesignable();
  const collection = useCollection();
  const field = collection.targetKey || 'id';
  const { filter, pageSize, fieldValue, resourceName } = fieldSchema['x-component-props'];
  const { data, run } = useRequest({
    resource: resourceName + ':list',
    params: {
      filter,
      pageSize: pageSize || 5,
      appends: fieldValue ? [fieldValue] : [],
    },
  });
  useEffect(() => {
    run();
  }, [filter, pageSize, fieldValue]);
  const changeNav = (imgItem) => {
    if (imgItem['isIdentical']) {
      const existence = properties?.find((value) => value['x-component-props']['fixedComponent']);
      if (existence) {
        navigate(`/mobile/${existence['x-uid']}/image/${resourceName}/${field}/${imgItem[field]}`);
      } else {
        insertAdjacent('beforeEnd', swiperCustomPage(imgItem, 'fixedComponent'), {
          onSuccess(res) {
            if (res) {
              navigate(`/mobile/${res['x-uid']}`);
            }
          },
        });
      }
    } else {
      const existence = properties?.find((value) => value.name === String(imgItem.id));
      if (existence) {
        navigate(`/mobile/${existence['x-uid']}`);
      } else {
        insertAdjacent('beforeEnd', swiperCustomPage(imgItem), {
          onSuccess(res) {
            if (res) {
              navigate(`/mobile/${res['x-uid']}`);
            }
          },
        });
      }
    }
  };

  return {
    data,
    fieldValue,
    changeNav,
  };
};

const swiperCustomPage = (imgItem, fixedComponent?) => {
  return {
    type: 'void',
    title: imgItem.title,
    name: imgItem.id,
    'x-component': 'MMenu.Item',
    'x-component-props': { imgItem, fixedComponent },
    'x-designer': 'MMenu.Item.Designer',
    properties: {
      page: {
        type: 'void',
        'x-component': 'MPage',
        'x-designer': 'MPage.Designer',
        'x-component-props': {},
        properties: {
          grid: {
            type: 'void',
            'x-component': 'Grid',
            'x-initializer': 'mobilePage:addBlock',
          },
        },
      },
    },
  };
};
