import { Context } from '@tachybase/actions';

import dayjs from 'dayjs';

export const getDailyActiveUser = async (ctx: Context) => {
  const repo = await ctx.db.getRepository('trackingEvents');
  // const configRepo = await ctx.db.getRepository('trackingEvents');
  const todayStart = dayjs().startOf('day').toDate();
  const todayEnd = dayjs().endOf('day').toDate();
  const weekStart = dayjs().subtract(6, 'day').startOf('day').toDate(); // 含今天，一共7天
  const monthStart = dayjs().subtract(29, 'day').startOf('day').toDate(); // 含今天，一共30天

  // 2. 查询所有30天内的 sign-in 数据
  const last30DaysData = await repo.find({
    filter: {
      key: 'sign-in',
      createdAt: {
        $gte: monthStart.toISOString(),
        $lte: todayEnd.toISOString(),
      },
    },
  });

  // 3. 按日期聚合，计算每日活跃账号（去重）
  const dayUserMap = new Map<string, Set<string>>(); // dateStr => Set<account>

  for (const item of last30DaysData) {
    const createdAt = item.createdAt || item.values?.createdAt;
    const account = item.values?.account;
    if (!createdAt || !account) continue;

    const dateStr = dayjs(createdAt).format('YYYY-MM-DD');
    if (!dayUserMap.has(dateStr)) {
      dayUserMap.set(dateStr, new Set());
    }
    dayUserMap.get(dateStr)!.add(account);
  }

  // 4. 获取今日活跃账号数量
  const todayKey = dayjs().format('YYYY-MM-DD');
  const todayActiveUserCount = dayUserMap.get(todayKey)?.size || 0;

  // 5. 计算过去7天、30天平均值
  const past7Days = Array.from({ length: 7 }, (_, i) => dayjs().subtract(i, 'day').format('YYYY-MM-DD'));
  const past30Days = Array.from({ length: 30 }, (_, i) => dayjs().subtract(i, 'day').format('YYYY-MM-DD'));

  const average = (dates: string[]) => {
    const total = dates.reduce((sum, dateStr) => {
      return sum + (dayUserMap.get(dateStr)?.size || 0);
    }, 0);
    return Math.round(total / dates.length);
  };

  const average7 = average(past7Days);
  const average30 = average(past30Days);

  return { todayActiveUserCount, average7, average30 };
};
