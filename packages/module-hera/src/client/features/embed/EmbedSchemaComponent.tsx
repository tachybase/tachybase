import React from 'react';
import { RemoteSchemaComponent } from '@tachybase/client';

import { useParams } from 'react-router-dom';

export function EmbedSchemaComponent() {
  const params = useParams();
  return <RemoteSchemaComponent uid={params.name} />;
}
