import { useParams } from 'react-router';

import { RemoteSchemaComponent } from '../../schema-component';

export function ShareSchemaComponent() {
  const params = useParams();

  return <RemoteSchemaComponent uid={params.name} />;
}
