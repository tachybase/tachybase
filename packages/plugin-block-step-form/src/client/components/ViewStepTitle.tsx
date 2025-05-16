import { RecursionField } from '@tachybase/schema';

import { getSchemaViewStepTitle } from './ViewStepTitle.schema';

export const ViewStepTitle = (props) => {
  const { title, contentSchema, name, index } = props;
  const key = `${title}${index}`;
  const schema = getSchemaViewStepTitle({ title, name, contentSchema });
  return <RecursionField key={key} name={key} schema={schema} />;
};
