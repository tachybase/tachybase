import { APIClient, APIClientProvider, compose, useRequest } from '@tachybase/client';
import MockAdapter from 'axios-mock-adapter';
import React from 'react';

const apiClient = new APIClient();

const mock = new MockAdapter(apiClient.axios);

mock.onGet('/users:get').reply(200, {
  data: { id: 1, name: 'John Smith' },
});

const providers = [[APIClientProvider, { apiClient }]];

export default compose(...providers)(() => {
  const { data } = useRequest<{
    data: any;
  }>({
    url: 'users:get',
    method: 'get',
  });
  return <div>{data?.data?.name}</div>;
});
