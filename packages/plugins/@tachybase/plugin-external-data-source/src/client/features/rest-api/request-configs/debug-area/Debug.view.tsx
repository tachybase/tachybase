import React from 'react';
import { Action, FormItem, Input, InputNumber, SchemaComponent, Space, Variable } from '@tachybase/client';
import { Form, FormLayout } from '@tachybase/components';

import { Card, Col, Row, Select } from 'antd';

import { useTranslation } from '../../../../locale';
import { useVariableOptions } from '../../scopes/useVariableOptions';
import { getSchemaDebug } from './Debug.schema';
import { useCancelAction } from './scopes/useCancelAction';
import { useDebugAction } from './scopes/useDebugAction';

export const ViewDebug = () => {
  const { t } = useTranslation();
  const schema = getSchemaDebug();

  return (
    <SchemaComponent
      schema={schema}
      components={{
        Form,
        Input,
        Action,
        FormItem,
        InputNumber,
        Card,
        Variable,
        Space,
        Select,
        FormLayout,
        Row,
        Col,
      }}
      scope={{
        t,
        useDebugAction,
        useCancelAction,
        useVariableOptions,
      }}
    />
  );
};
