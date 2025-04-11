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
  };
};

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

  const matchesValues = (values: Record<string, any>) => {
    return Object.entries(filterValues).every(([k, v]) => values[k] === v);
  };

  const matchesTime = (item: any): boolean => {
    if (!timeFilter) return true;

    const raw = item.createdAt;
    if (!raw) return false;

    const time = new Date(raw);
    if (isNaN(time.getTime())) return false;

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
    if (!matchesValues(item.values)) continue;
    if (!matchesTime(item)) continue;

    const key = dedupBy ? item.values[dedupBy] : '__no_dedup__';
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
