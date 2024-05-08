import React from 'react';
import { ISchema, useFieldSchema } from '@tachybase/schema';
import { SchemaSettingsModalItem, useCollectionManager, useDesignable } from '@tachybase/client';
import { tval, useTranslation } from '../locale';
import { dayjs } from '@tachybase/utils/client';

export const useCustomPresets1 = () => {
  const fieldSchema = useFieldSchema();
  const { t } = useTranslation();
  const rangesValue = getDateRanges();
  const presets = [
    { label: t('This year'), value: rangesValue.thisYear },
    ...Array(5)
      .fill(0)
      .map((_, i) => ({ label: dayjs().year() - i - 1 + t('year'), value: rangesValue.year(dayjs().year() - i - 1) })),
    { label: t('This month'), value: rangesValue.thisMonth },
    { label: t('Last month'), value: rangesValue.lastMonth },
  ];
  if (fieldSchema.name === 'presets') {
    return '{{ useCustomPresets1() }}';
  }
  return presets;
};

export const useCustomPresets = (name: string) => {
  return '{{ ' + name + '() }}';
};

export const SchemaSettingsDatePresets: React.FC = () => {
  const fieldSchema = useFieldSchema();
  const { dn } = useDesignable();
  const { t } = useTranslation();
  const cm = useCollectionManager();
  const collectionField = cm.getCollectionField(fieldSchema?.['x-collection-field']) || {};
  const defaultPresets =
    fieldSchema?.['x-component-props']?.presets || collectionField?.uiSchema?.['x-component-props']?.presets || '';
  return (
    <SchemaSettingsModalItem
      title={t('Date presets')}
      schema={
        {
          type: 'object',
          properties: {
            presets: {
              type: 'string',
              title: tval('Date presets'),
              'x-component': 'Select',
              'x-decorator': 'FormItem',
              'x-decorator-props': {},
              default: defaultPresets,
              enum: [
                {
                  label: t('default'),
                  value: '',
                },
                {
                  label: t('Chuangxing presets'),
                  value: '{{ useCustomPresets("useCustomPresets1") }}',
                },
              ],
            },
          },
        } as ISchema
      }
      onSubmit={(data) => {
        if (!data['presets']) {
          // 强制清空来达到默认值的效果
          data['presets'] = undefined;
        }
        const schema = {
          ['x-uid']: fieldSchema['x-uid'],
        };
        schema['x-component-props'] = fieldSchema['x-component-props'] || {};
        fieldSchema['x-component-props'] = {
          ...(fieldSchema['x-component-props'] || {}),
          ...data,
        };
        schema['x-component-props'] = fieldSchema['x-component-props'];
        // 这里有意不做直接刷新，直接刷新需要解析 {{ }} 对应的值，待完成后才可以做
        dn.emit('patch', {
          schema,
        });
        dn.refresh();
      }}
    />
  );
};

SchemaSettingsDatePresets.displayName = 'SchemaSettingsDatePresets';

const getDateRanges = () => {
  return {
    now: () => dayjs().toISOString(),
    today: () => [getStart(0, 'day'), getEnd(0, 'day')],
    yesterday: () => [getStart(-1, 'day'), getEnd(-1, 'day')],
    tomorrow: () => [getStart(1, 'day'), getEnd(1, 'day')],
    thisWeek: () => [getStart(0, 'isoWeek'), getEnd(0, 'isoWeek')],
    lastWeek: () => [getStart(-1, 'isoWeek'), getEnd(-1, 'isoWeek')],
    nextWeek: () => [getStart(1, 'isoWeek'), getEnd(1, 'isoWeek')],
    year: (year: number) => [getStart(year - dayjs().year(), 'year'), getEnd(year - dayjs().year(), 'year')],
    thisIsoWeek: () => [getStart(0, 'isoWeek'), getEnd(0, 'isoWeek')],
    lastIsoWeek: () => [getStart(-1, 'isoWeek'), getEnd(-1, 'isoWeek')],
    nextIsoWeek: () => [getStart(1, 'isoWeek'), getEnd(1, 'isoWeek')],
    thisMonth: () => [getStart(0, 'month'), getEnd(0, 'month')],
    lastMonth: () => [getStart(-1, 'month'), getEnd(-1, 'month')],
    nextMonth: () => [getStart(1, 'month'), getEnd(1, 'month')],
    thisQuarter: () => [getStart(0, 'quarter'), getEnd(0, 'quarter')],
    lastQuarter: () => [getStart(-1, 'quarter'), getEnd(-1, 'quarter')],
    nextQuarter: () => [getStart(1, 'quarter'), getEnd(1, 'quarter')],
    thisYear: () => [getStart(0, 'year'), getEnd(0, 'year')],
    lastYear: () => [getStart(-1, 'year'), getEnd(-1, 'year')],
    nextYear: () => [getStart(1, 'year'), getEnd(1, 'year')],
    last7Days: () => [getStart(-6, 'days'), getEnd(0, 'days')],
    next7Days: () => [getStart(1, 'day'), getEnd(7, 'days')],
    last30Days: () => [getStart(-29, 'days'), getEnd(0, 'days')],
    next30Days: () => [getStart(1, 'day'), getEnd(30, 'days')],
    last90Days: () => [getStart(-89, 'days'), getEnd(0, 'days')],
    next90Days: () => [getStart(1, 'day'), getEnd(90, 'days')],
  };
};

const getStart = (offset: any, unit: any) => {
  return dayjs()
    .add(offset, unit === 'isoWeek' ? 'week' : unit)
    .startOf(unit);
};

const getEnd = (offset: any, unit: any) => {
  return dayjs()
    .add(offset, unit === 'isoWeek' ? 'week' : unit)
    .endOf(unit);
};
