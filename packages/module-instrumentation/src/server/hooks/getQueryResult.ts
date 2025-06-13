import dayjs from 'dayjs';

import { filterMatch } from './filterMatch';

type FilterConfig = {
  key: string | string[];
  filterValues?: Record<string, any>;
  timeFilter?: {
    after?: string;
    before?: string;
    on?: string;
    today?: true;
    rangeDays?: number;
  };
};

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getDataByEventFrequency(data: any[], config: FilterConfig): any {
  const { key: filterKey, filterValues = {}, timeFilter } = config;

  const matchKey = (itemKey: string) => {
    if (Array.isArray(filterKey)) return filterKey.includes(itemKey);
    return itemKey === filterKey;
  };

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

  const groupMap = [];

  for (const item of data) {
    if (!matchKey(item.key)) continue;
    if (!filterMatch(item.values, filterValues)) continue;
    if (!matchesTime(item)) continue;
    groupMap.push(item);
  }

  return groupMap;
}
