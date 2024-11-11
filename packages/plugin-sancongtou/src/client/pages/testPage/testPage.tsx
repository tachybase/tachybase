import React, { useState } from 'react';
import { css, useRequest } from '@tachybase/client';

import { useLocation, useParams } from 'react-router-dom';

export const TestPage = () => {
  const search = useLocation().search;
  const { dataSource, collection } = useParams();
  const filter = {};
  if (search.includes('?')) {
    const options = search.slice(1).split('&');
    options.forEach((item) => {
      const filterValue = item.split('=');
      filter[filterValue[0]] = filterValue[1];
    });
  }
  const { data } = useRequest({
    resource: collection,
    action: 'list',
    params: {
      filter,
      appends: ['main_images'],
    },
  });
  return (
    data?.data && (
      <div
        className={css`
          width: 100%;
          height: 100%;
          background-color: 255, 249, 243;
        `}
      >
        {data.data?.map((item) => {
          return (
            <div key={item.id}>
              {item.main_images?.map((image) => {
                return <img src={image.url} key={item.id} />;
              })}
            </div>
          );
        })}
      </div>
    )
  );
};
