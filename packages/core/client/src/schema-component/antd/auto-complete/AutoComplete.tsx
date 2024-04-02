import { connect, mapProps, mapReadPretty } from '@nocobase/schema';
import { AutoComplete as AntdAutoComplete } from 'antd';
import { ReadPretty } from '../input';

export const AutoComplete = connect(
  AntdAutoComplete,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(ReadPretty.Input),
);
