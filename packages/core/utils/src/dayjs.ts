import dayjs, { type Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import calendar from 'dayjs/plugin/calendar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import IsBetween from 'dayjs/plugin/isBetween';
import isoWeek from 'dayjs/plugin/isoWeek';
import IsSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import tz from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import weekYear from 'dayjs/plugin/weekYear';

// 解决 build 报 dayjs 相关类型错误的问题
import 'dayjs/plugin/isBetween';
import 'dayjs/plugin/isSameOrAfter';
import 'dayjs/plugin/isSameOrBefore';
import 'dayjs/plugin/isoWeek';
import 'dayjs/plugin/localeData';
import 'dayjs/plugin/quarterOfYear';
import 'dayjs/plugin/utc';
import 'dayjs/plugin/weekday';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(tz);
dayjs.extend(utc);
dayjs.extend(quarterOfYear);
dayjs.extend(isoWeek);
dayjs.extend(IsBetween);
dayjs.extend(IsSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(calendar);

export { dayjs, Dayjs };
