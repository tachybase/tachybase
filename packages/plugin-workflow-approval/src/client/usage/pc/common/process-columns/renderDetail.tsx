import { useContext } from 'react';
import { DatePicker, InputReadPretty, RecordProvider, useCurrentUserContext } from '@tachybase/client';

import { ViewCheckLink as ViewCheckLinkInitiations } from '../../block/initiations-table/CheckLink.view';
import { ViewCheckLink as ViewCheckLinkTodos } from '../../block/todos-table/CheckLink.view';
import { ContextWithActionEnabled } from '../WithActionEnabled.provider';

export function renderDetail(text, record, index) {
  return <ColumnDetail text={text} record={record} exist={index > 0} />;
}

const ColumnDetail = (props) => {
  const { exist, record } = props;
  return exist ? <ColumnDetailExist {...record} /> : <ColumnDetailNotExist {...record} />;
};

// Exist
const ColumnDetailExist = (props) => {
  const { data } = useCurrentUserContext();
  const { actionEnabled } = useContext(ContextWithActionEnabled);
  return (
    <>
      {props.status ? (
        <>
          {[
            props.comment ? <InputReadPretty.TextArea value={props.comment} /> : null,
            <time key="time">{<DatePicker.ReadPretty value={props.updatedAt} showTime={true} />}</time>,
          ]}
        </>
      ) : null}
      {actionEnabled && props.userId === data?.data.id ? (
        // @ts-ignore
        <RecordProvider record={props} parent={false}>
          <ViewCheckLinkTodos />
        </RecordProvider>
      ) : null}
    </>
  );
};

// Not Exist
const ColumnDetailNotExist = (props) => {
  const { data } = useCurrentUserContext();
  const { actionEnabled } = useContext(ContextWithActionEnabled);
  return (
    <>
      <time key={'time'}>{<DatePicker.ReadPretty value={props.updatedAt} showTime={true} />}</time>
      {actionEnabled && props.user.id === data?.data.id ? (
        // @ts-ignore
        <RecordProvider record={props.execution} parent={false}>
          <ViewCheckLinkInitiations />
        </RecordProvider>
      ) : null}
    </>
  );
};
