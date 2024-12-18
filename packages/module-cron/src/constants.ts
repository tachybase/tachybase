export const NAMESPACE = 'cron';

export const DATABASE_CRON_JOBS = 'cronJobs';

export enum SCHEDULE_MODE {
  STATIC = 0,
  // 数据表任务,数据表定时清理/每日统计等
  DATE_FIELD = 1,
}
