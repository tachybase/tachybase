import { useParams } from 'react-router';

import { RemoteSchemaComponent, SchemaComponentContext, useSchemaComponentContext } from '../../schema-component';

export function ShareSchemaComponent() {
  const params = useParams();
  const context = useSchemaComponentContext();

  return (
    // 分享页禁用设计者模式
    <SchemaComponentContext.Provider value={{ ...context, designable: false }}>
      <RemoteSchemaComponent uid={params.name} />
    </SchemaComponentContext.Provider>
  );
}
