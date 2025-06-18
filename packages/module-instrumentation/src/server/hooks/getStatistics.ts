import dayjs from 'dayjs';

import { filterMatch } from './filterMatch';

type FilterConfig = {
  filterKey: string | string[];
  filterValues?: Record<string, any>;
  dedupBy?: string;
  minCount: number;
  timeFilter?: {
    after?: string;
    before?: string;
    on?: string;
    today?: true;
    rangeDays?: number;
  };
  timeGroup?: string;
};

function getValueByPath(obj: any, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj);
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function countDataByEventFrequency(data: any[], config: FilterConfig): number {
  const { filterKey, filterValues = {}, dedupBy, minCount = 1, timeFilter } = config;

  const matchKey = (itemKey: string) => {
    if (Array.isArray(filterKey)) return filterKey.includes(itemKey);
    return itemKey === filterKey;
  };

  // const matchesValues = (values: Record<string, any>) => {
  //   return Object.entries(filterValues).every(([k, v]) => values[k] === v);
  // };

  const matchesTime = (item: any): boolean => {
    if (!timeFilter) return true;

    const raw = item.createdAt;
    if (!raw) return false;

    const time = new Date(raw);
    if (isNaN(time.getTime())) return false;

    const now = new Date();

    if (timeFilter.rangeDays !== undefined) {
      const start = dayjs()
        .subtract(timeFilter.rangeDays - 1, 'day')
        .startOf('day')
        .toDate();
      const end = dayjs().endOf('day').toDate();
      return time >= start && time <= end;
    }

    if (timeFilter.today) {
      return isSameDay(time, new Date());
    }

    if (timeFilter.on) {
      const target = new Date(timeFilter.on);
      if (isNaN(target.getTime())) return false;
      return isSameDay(time, target);
    }

    if (timeFilter.after) {
      const after = new Date(timeFilter.after);
      if (isNaN(after.getTime())) return false;
      if (time < after) return false;
    }

    if (timeFilter.before) {
      const before = new Date(timeFilter.before);
      if (isNaN(before.getTime())) return false;
      if (time > before) return false;
    }

    return true;
  };

  // 分组：key = dedupBy 字段，value = 所有匹配记录
  const groupMap = {};

  for (const item of data) {
    if (!matchKey(item.key)) continue;
    if (!filterMatch(item.values, filterValues)) continue;
    if (!matchesTime(item)) continue;

    const key = dedupBy ? getValueByPath(item.values, dedupBy) : '__no_dedup__';
    if (!key) continue;

    if (!groupMap[key]) groupMap[key] = [];
    groupMap[key].push(item);
  }

  let count = 0;
  if (dedupBy) {
    for (const key in groupMap) {
      if (groupMap[key].length >= minCount) {
        count++;
      }
    }
  } else {
    count = groupMap['__no_dedup__']?.length ?? 0;

    if (count < minCount) {
      count = 0;
    }
  }

  return count;
}

export function groupDataByTime(data: any[], config: FilterConfig): Record<string, number> {
  const { filterKey, filterValues = {}, dedupBy, minCount = 1, timeFilter, timeGroup = 'day' } = config;

  const matchKey = (itemKey: string) => {
    if (Array.isArray(filterKey)) return filterKey.includes(itemKey);
    return itemKey === filterKey;
  };

  const matchesValues = (values: Record<string, any>) => {
    return Object.entries(filterValues).every(([k, v]) => values[k] === v);
  };

  const matchesTime = (item: any): boolean => {
    if (!timeFilter) return true;
    const raw = item.createdAt;
    if (!raw) return false;
    const time = new Date(raw);
    if (isNaN(time.getTime())) return false;

    if (timeFilter.rangeDays !== undefined) {
      const start = dayjs()
        .subtract(timeFilter.rangeDays - 1, 'day')
        .startOf('day')
        .toDate();
      const end = dayjs().endOf('day').toDate();
      return time >= start && time <= end;
    }

    if (timeFilter.today) {
      return isSameDay(time, new Date());
    }

    if (timeFilter.on) {
      const target = new Date(timeFilter.on);
      if (isNaN(target.getTime())) return false;
      return isSameDay(time, target);
    }

    if (timeFilter.after) {
      const after = new Date(timeFilter.after);
      if (isNaN(after.getTime())) return false;
      if (time < after) return false;
    }

    if (timeFilter.before) {
      const before = new Date(timeFilter.before);
      if (isNaN(before.getTime())) return false;
      if (time > before) return false;
    }

    return true;
  };

  // 初始化时间段（用于补全日期）
  const range = timeFilter?.rangeDays ?? 30;
  const now = dayjs().endOf('day');
  const start = dayjs()
    .subtract(range - 1, 'day')
    .startOf('day');

  const dateMap: Record<string, any[]> = {};

  for (let i = 0; i < range; i++) {
    const date = start.add(i, 'day');
    let key: string;
    if (timeGroup === 'week') {
      const start = date.startOf('week');
      const end = date.endOf('week');
      key = `${start.format('MM-DD')}~${end.format('MM-DD')}`;
    } else if (timeGroup === 'month') {
      key = date.startOf('month').format('YYYY-MM');
    } else {
      key = date.format('MM-DD');
    }
    dateMap[key] = [];
  }

  for (const item of data) {
    if (!matchKey(item.key)) continue;
    if (!matchesValues(item.values)) continue;
    if (!matchesTime(item)) continue;

    const time = dayjs(item.createdAt);
    let groupKey: string;

    if (timeGroup === 'week') {
      const start = time.startOf('week');
      const end = time.endOf('week');
      groupKey = `${start.format('MM-DD')}~${end.format('MM-DD')}`;
    } else if (timeGroup === 'month') {
      groupKey = time.startOf('month').format('YYYY-MM');
    } else {
      groupKey = time.format('MM-DD');
    }

    if (!dateMap[groupKey]) {
      dateMap[groupKey] = [];
    }
    dateMap[groupKey].push(item);
  }

  const result: Record<string, number> = {};

  for (const key in dateMap) {
    const group = dateMap[key];
    if (dedupBy) {
      const dedupSet = new Map<string, number>();
      for (const item of group) {
        const id = getValueByPath(item.values, dedupBy);
        if (!id) continue;
        dedupSet.set(id, (dedupSet.get(id) ?? 0) + 1);
      }
      result[key] = Array.from(dedupSet.values()).filter((v) => v >= minCount).length;
    } else {
      const count = group.length;
      result[key] = count >= minCount ? count : 0;
    }
  }

  return result;
}
