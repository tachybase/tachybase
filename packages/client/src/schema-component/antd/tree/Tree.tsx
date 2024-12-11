import React, { useEffect, useState } from 'react';
import { ArrayField, observer, useField, useFieldSchema } from '@tachybase/schema';

import { Tree as AntdTree } from 'antd';

import { useTreeBlockContext } from '../../../';
import { withDynamicSchemaProps } from '../../../application/hoc';

const useArrayField = (props) => {
  const field = useField<ArrayField>();
  return (props.field || field) as ArrayField;
};

const replacePlaceholders = (inputStr, values) => {
  return inputStr.replace(/{{(.*?)}}/g, function (match, placeholder) {
    return values?.hasOwnProperty(placeholder) ? values[placeholder] : match;
  });
};
function findIds(arr) {
  let ids = [];

  function recurse(array) {
    array?.forEach((item) => {
      if (item.id) {
        ids.push(item.id);
      }
      if (item.children) {
        recurse(item.children);
      }
    });
  }

  recurse(arr);
  return ids;
}

export const Tree = withDynamicSchemaProps(
  observer((props: any) => {
    console.log('🚀 ~ file: Tree.tsx:39 ~ props:', props);
    const schema = useFieldSchema();
    const [expandedKeys, setExpandedKeys] = useState([]);
    const { expandFlag, sleepTime, titleRender: titleRenderText } = schema?.parent['x-decorator-props'] || {};
    const { service, expandFlag: expandFlagCtx } = useTreeBlockContext();
    const titleRender = (nodeData) => {
      const valueOject = {};
      let outputStr = '';
      if (titleRenderText && titleRenderText.includes('{{')) {
        const regex = /{{(.*?)}}/g;
        let match;
        while ((match = regex.exec(titleRenderText))) {
          valueOject[match[1]] = nodeData[match[1]] || '';
        }
        outputStr = replacePlaceholders(titleRenderText, valueOject);
        return outputStr;
      } else {
        return nodeData.title;
      }
    };
    // 获取当前节点挂在数据，需要配合 observer 使用
    const field = useArrayField(props);
    const { onSelectNode } = props;
    const treeData = field?.data?.treeData;

    useEffect(() => {
      let timer: any = null;
      if (sleepTime > 0) {
        timer = setInterval(
          () => {
            service.refresh();
          },
          Number(sleepTime) * 1000,
        );
      }
      return () => {
        timer && clearInterval(timer);
      };
    }, []);

    useEffect(() => {
      const ids = findIds(field?.data?.treeData);
      setExpandedKeys(!expandFlagCtx ? [] : ids);
    }, [expandFlagCtx, field?.data?.treeData]);

    useEffect(() => {
      const ids = findIds(field?.data?.treeData);
      setExpandedKeys(!expandFlag ? [] : ids);
    }, [expandFlag, field?.data?.treeData]);

    return (
      <AntdTree
        {...props}
        treeData={treeData}
        titleRender={titleRender}
        onSelect={onSelectNode}
        expandedKeys={expandedKeys}
        onExpand={(expandedKey) => {
          setExpandedKeys(expandedKey);
        }}
      />
    );
  }),
);
