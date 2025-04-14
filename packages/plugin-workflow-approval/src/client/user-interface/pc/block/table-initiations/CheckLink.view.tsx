import { SchemaComponent, useRecord } from '@tachybase/client';

import { CheckContent } from './CheckContent';
import { getSchemaActionLaunch } from './CheckLink.schema';
import { ProviderRecord } from './providers/Record.provider';

// 审批-发起: 操作-查看
export const ViewCheckLink = (props) => {
  const { popoverComponent = 'Action.Drawer', popoverComponentProps = {} } = props;
  const record = useRecord();
  const schema = getSchemaActionLaunch({ record, popoverComponent, popoverComponentProps });
  return (
    <SchemaComponent
      schema={schema}
      components={{
        ProviderRecord,
        CheckContent,
      }}
    />
  );
};
