import { BlockItem, css, useAPIClient, useRequest } from '@tachybase/client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AutoCenter, Card, SearchBar, Selector, Space } from 'antd-mobile';
import { TeamFill } from 'antd-mobile-icons';

export const InitiationsBlock = () => {
  const [options, setOptions] = useState([]);
  const api = useAPIClient();
  const navigate = useNavigate();
  useEffect(() => {
    api
      .request({
        url: 'workflows:list',
        params: { pageSize: 9999, filter: { type: { $eq: 'approval' }, enabled: { $eq: true } } },
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
                  navigate(`/mobile/${value.config.collection}/approval/${value.id}/page`);
                }}
              >
                <div>
                  <TeamFill />
                </div>
                {value.title?.replace('审批流:', '') || ''}
              </div>
            ),
          };
        });
        setOptions(option);
      })
      .catch(() => {});
  }, []);
  return (
    <BlockItem>
      <div style={{ padding: '10px', height: '90vh' }}>
        <SearchBar placeholder="请输入内容" clearable style={{ '--background': '#ffffff' }} />
        <Card
          className={css`
            overflow: hidden;
            margin-top: 20px;
            .adm-card-body {
              padding: 0;
            }
          `}
          style={{ padding: '0', backgroundColor: '#f3f3f3' }}
        >
          <Selector
            style={{ '--color': '#ffffff', '--gap': '1px' }}
            columns={3}
            showCheckMark={false}
            options={options}
          />
        </Card>
      </div>
    </BlockItem>
  );
};
