import { RemoteSchemaComponent } from '@nocobase/client';
import React from 'react';
import { useParams } from 'react-router-dom';

export function EmbedSchemaComponent() {
  const params = useParams();
  return <RemoteSchemaComponent uid={params.name} />;
}
