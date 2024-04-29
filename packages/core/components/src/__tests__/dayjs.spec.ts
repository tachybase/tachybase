import dayjs from 'dayjs';
import { formatDayjsValue, dayjsable } from '../__builtins__/dayjs';

test('dayjsable is usable', () => {
  expect(dayjs.isDayjs(dayjsable('2021-09-08'))).toBe(true);
  expect(dayjs.isDayjs(dayjsable('12:11'))).toBe(false);
  expect(dayjs.isDayjs(dayjsable(''))).toBe(false);
  expect(dayjsable(['2021-09-08', '2021-12-29']).every((item) => dayjs.isDayjs(item))).toBe(true);
  expect(dayjsable(['12:11', '2021-12-29']).every((item) => dayjs.isDayjs(item))).toBe(false);
});

test('formatDayjsValue is usable', () => {
  expect(formatDayjsValue('', 'YYYY-MM-DD', '~')).toBe('~');
  expect(formatDayjsValue([''], 'YYYY-MM-DD', '~')).toEqual(['~']);
  expect(formatDayjsValue(['', '12:11'], 'YYYY-MM-DD', '~')).toEqual(['~', '12:11']);

  expect(formatDayjsValue('2021-12-21 15:47:00', 'YYYY-MM-DD')).toBe('2021-12-21');
  expect(formatDayjsValue('2021-12-21 15:47:00', undefined)).toBe('2021-12-21 15:47:00');
  expect(formatDayjsValue('2021-12-21 15:47:00', (date: string) => date)).toBe('2021-12-21 15:47:00');
  expect(formatDayjsValue('12:11', 'HH:mm')).toBe('12:11');
  expect(formatDayjsValue('12:11:11', 'HH:mm:ss')).toBe('12:11:11');
  expect(formatDayjsValue(['12:11'], ['HH:mm'])).toEqual(['12:11']);
  expect(formatDayjsValue(['12:11:11'], ['HH:mm:ss'])).toEqual(['12:11:11']);
  expect(formatDayjsValue(1663155911097, 'YYYY-MM-DD HH:mm:ss')).toBe(
    dayjs(1663155911097).format('YYYY-MM-DD HH:mm:ss'),
  );
  expect(formatDayjsValue([1663155911097], ['YYYY-MM-DD HH:mm:ss'])).toEqual([
    dayjs(1663155911097).format('YYYY-MM-DD HH:mm:ss'),
  ]);
  expect(formatDayjsValue('2022-09-15T09:56:26.000Z', 'YYYY-MM-DD HH:mm:ss')).toBe(
    dayjs('2022-09-15T09:56:26.000Z').format('YYYY-MM-DD HH:mm:ss'),
  );
  expect(formatDayjsValue(['2022-09-15T09:56:26.000Z'], ['YYYY-MM-DD HH:mm:ss'])).toEqual([
    dayjs('2022-09-15T09:56:26.000Z').format('YYYY-MM-DD HH:mm:ss'),
  ]);
  expect(formatDayjsValue('2022-09-15 09:56:26', 'HH:mm:ss')).toBe('09:56:26');
  expect(formatDayjsValue(['2022-09-15 09:56:26'], ['HH:mm:ss'])).toEqual(['09:56:26']);
  expect(formatDayjsValue(['2021-12-21 15:47:00', '2021-12-29 15:47:00'], 'YYYY-MM-DD')).toEqual([
    '2021-12-21',
    '2021-12-29',
  ]);
  expect(formatDayjsValue(['2021-12-21 16:47:00', '2021-12-29 18:47:00'], (date: string) => date)).toEqual([
    '2021-12-21 16:47:00',
    '2021-12-29 18:47:00',
  ]);
  expect(
    formatDayjsValue(['2021-12-21 16:47:00', '2021-12-29 18:47:00'], ['YYYY-MM-DD', (date: string) => date]),
  ).toEqual(['2021-12-21', '2021-12-29 18:47:00']);
  expect(formatDayjsValue(['2021-12-21 16:47:00', '2021-12-29 18:47:00'], ['YYYY-MM-DD', undefined])).toEqual([
    '2021-12-21',
    '2021-12-29 18:47:00',
  ]);
});
