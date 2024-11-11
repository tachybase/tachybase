import dayjs from 'dayjs';

const convertFormat = (currentDate, formatText) => {
  return dayjs(currentDate).format(formatText);
};

export const converDate = (currentDate: Date, formatText: string) => {
  return convertFormat(currentDate, formatText);
};
