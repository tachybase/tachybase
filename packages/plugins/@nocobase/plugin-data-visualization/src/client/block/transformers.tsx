import React from 'react';
import { Popover, Space, Tag } from 'antd';
import dayjs from 'dayjs';

export type Transformer = (val: any, locale?: string) => string | number | React.JSX.Element;

const transformers: {
  [key: string]: {
    [key: string]:
      | Transformer
      | {
          [key: string]: Transformer;
        };
  };
} = {
  datetime: {
    YYYY: (val: string) => dayjs(val).format('YYYY'),
    MM: (val: string) => dayjs(val).format('MM'),
    DD: (val: string) => dayjs(val).format('DD'),
    'YYYY-MM': (val: string) => dayjs(val).format('YYYY-MM'),
    'YYYY-MM-DD': (val: string) => dayjs(val).format('YYYY-MM-DD'),
    'YYYY-MM-DD hh:mm': (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm'),
    'YYYY-MM-DD hh:mm:ss': (val: string) => dayjs(val).format('YYYY-MM-DD hh:mm:ss'),
  },
  date: {
    YYYY: (val: string) => dayjs(val).format('YYYY'),
    MM: (val: string) => dayjs(val).format('MM'),
    DD: (val: string) => dayjs(val).format('DD'),
    'YYYY-MM': (val: string) => dayjs(val).format('YYYY-MM'),
    'YYYY-MM-DD': (val: string) => dayjs(val).format('YYYY-MM-DD'),
  },
  time: {
    'hh:mm:ss': (val: string) => dayjs(val).format('hh:mm:ss'),
    'hh:mm': (val: string) => dayjs(val).format('hh:mm'),
    hh: (val: string) => dayjs(val).format('hh'),
  },
  number: {
    Percent: (val: number) =>
      new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
        val,
      ),
    Currency: (val: number, locale = 'en-US') => {
      const currency = {
        'zh-CN': 'CNY',
        'en-US': 'USD',
        'ja-JP': 'JPY',
        'ko-KR': 'KRW',
        'pt-BR': 'BRL',
        'ru-RU': 'RUB',
        'tr-TR': 'TRY',
        'es-ES': 'EUR',
      }[locale];
      return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(val);
    },
    Exponential: (val: number | string) => (+val)?.toExponential(),
    Abbreviation: (val: number, locale = 'en-US') => new Intl.NumberFormat(locale, { notation: 'compact' }).format(val),
    Decimal: {
      TwoDigits: (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
          val,
        ),
      ThreeDigits: (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(
          val,
        ),
      FourDigits: (val: number) =>
        new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(
          val,
        ),
    },
  },
  array: {
    title: (items: string[]) => {
      return (
        <Popover
          content={
            <Space>
              {items.map((item) => (
                <Tag key={item}>{item}</Tag>
              ))}
            </Space>
          }
        >
          <Space>
            {items.slice(0, 2).map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </Space>
          {items.length > 2 ? '...' : ''}
        </Popover>
      );
    },
  },
};

export default transformers;
