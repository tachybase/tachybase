import { BlockItem, css } from '@nocobase/client';
import React from 'react';
import { AutoCenter, Card, SearchBar, Selector, Space } from 'antd-mobile';
import { TeamFill } from 'antd-mobile-icons';

export const InitiationsBlock = () => {
  return (
    <BlockItem>
      <div style={{ padding: '10px' }}>
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
            options={[
              {
                value: '1',
                label: (
                  <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                    <div>
                      <TeamFill />
                    </div>
                    11111
                  </div>
                ),
              },
              {
                value: '2',
                label: (
                  <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                    <div>
                      <TeamFill />
                    </div>
                    11111
                  </div>
                ),
              },
              {
                value: '3',
                label: (
                  <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                    <div>
                      <TeamFill />
                    </div>
                    11111
                  </div>
                ),
              },
            ]}
          />
        </Card>
      </div>
    </BlockItem>
  );
};
