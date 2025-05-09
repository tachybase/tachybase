import { useParams } from 'react-router';

import { RemoteSchemaComponent } from '../../schema-component';

export function ShareSchemaComponent() {
  const params = useParams();
  console.log('🚀 ~ ShareSchemaComponent ~ params:', params);

  return <RemoteSchemaComponent uid={params.name} />;
}
