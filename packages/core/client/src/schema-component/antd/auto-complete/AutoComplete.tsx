import { connect, mapProps, mapReadPretty } from '@tachybase/schema';

import { AutoComplete as AntdAutoComplete } from 'antd';

import { ReadPretty } from '../input';

export const AutoComplete = connect(
  AntdAutoComplete,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(ReadPretty.Input),
);
