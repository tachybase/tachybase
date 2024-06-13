import React from 'react';

import { Empty } from 'antd';
import _ from 'lodash';

import { withDynamicSchemaProps } from '../../../application/hoc/withDynamicSchemaProps';
import { useDataBlockRequest } from '../../../data-source';
import { FormV2 } from '../form-v2';

export const Details = withDynamicSchemaProps((props) => {
  const request = useDataBlockRequest();

  if (!request?.loading && _.isEmpty(request?.data?.data)) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return <FormV2 {...props} />;
});
