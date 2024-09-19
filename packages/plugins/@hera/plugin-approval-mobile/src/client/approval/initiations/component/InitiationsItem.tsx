import React, { useContext, useEffect, useState } from 'react';
import { BlockItem, useAPIClient } from '@tachybase/client';
import { observer } from '@tachybase/schema';

import { Card, Empty, Selector } from 'antd-mobile';
import { TeamFill } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';

import '../../style/style.css';

import { InitiationsBlockContext } from '../InitiationsBlock';

export const InitiationsItem = observer((props) => {
  const { params, tabKey } = props as any;
  const [options, setOptions] = useState([]);
  const api = useAPIClient();
  const navigate = useNavigate();
  const contextFilter = useContext(InitiationsBlockContext);
  const filter = contextFilter['key'] === 'initiations' ? contextFilter['inputFilter'] : '';

  useEffect(() => {
    api
      .request({
        url: 'workflows:list',
        params: {
          pageSize: 9999,
          filter: { ...params?.[tabKey] },
          sort: 'createdAt',
        },
      })
      .then((res) => {
        const option = res?.data?.data.map((value) => {
          return {
            ...value,
            value: value.id,
            label: (
              <div
                style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}
                onClick={(c) => {
                  navigate(`/mobile/${value.title || ''}/approval/${value.id}/page`);
                }}
              >
                <div>
                  <TeamFill />
                </div>
                {value.title || ''}
              </div>
            ),
          };
        });
        if (filter && options.length) {
          const filterData = option.filter((value) => (value.title as string)?.includes(filter));
          setOptions(filterData);
        } else {
          setOptions(option);
        }
      })
      .catch(() => {});
  }, [params]);
  return (
    <BlockItem>
      <Card className="initiationsItemCard">
        {options.length ? (
          <Selector
            style={{ '--color': '#ffffff', '--gap': '1px' }}
            columns={3}
            showCheckMark={false}
            options={options}
          />
        ) : (
          <Empty description="暂无数据" />
        )}
      </Card>
    </BlockItem>
  );
});
