import React from 'react';

import { BranchesOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export const ConnectAssociationAction = (props) => {
  const { targetGraph, item } = props;
  return (
    <BranchesOutlined
      className="btn-assocition"
      onClick={() => {
        targetGraph.onConnectionAssociation(item);
      }}
    />
  );
};
