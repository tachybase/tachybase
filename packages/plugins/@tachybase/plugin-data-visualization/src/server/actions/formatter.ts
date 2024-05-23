import { Sequelize } from 'sequelize';

export const dateFormatFn = (
  sequelize: Sequelize,
  dialect: string,
  field: string,
  format: string,
  timezone: string,
) => {
  const reversedTimezone = timezone[0] === '+' ? '-' + timezone.slice(1) : '+' + timezone.slice(1);
  switch (dialect) {
    case 'sqlite':
      format = format
        .replace(/YYYY/g, '%Y')
        .replace(/MM/g, '%m')
        .replace(/DD/g, '%d')
        .replace(/hh/g, '%H')
        .replace(/mm/g, '%M')
        .replace(/ss/g, '%S');
      return sequelize.fn('strftime', format, sequelize.col(field));
    case 'mysql':
    case 'mariadb':
      format = format
        .replace(/YYYY/g, '%Y')
        .replace(/MM/g, '%m')
        .replace(/DD/g, '%d')
        .replace(/hh/g, '%H')
        .replace(/mm/g, '%i')
        .replace(/ss/g, '%S');
      return sequelize.fn('date_format', sequelize.col(field), format);
    case 'postgres':
      format = format.replace(/hh/g, 'HH24').replace(/mm/g, 'MI').replace(/ss/g, 'SS');
      return sequelize.fn('format_timestamp_with_timezone', sequelize.col(field), reversedTimezone, format);
    default:
      return sequelize.col(field);
  }
};

export const formatFn = (sequelize: Sequelize, dialect: string, field: string, format: string) => {
  switch (dialect) {
    case 'sqlite':
    case 'postgres':
      return sequelize.fn('format', format, sequelize.col(field));
    default:
      return field;
  }
};

export const formatter = (sequelize: Sequelize, type: string, field: string, format: string, timezone: string) => {
  const dialect = sequelize.getDialect();
  switch (type) {
    case 'date':
    case 'datetime':
    case 'time':
      return dateFormatFn(sequelize, dialect, field, format, timezone);
    default:
      return formatFn(sequelize, dialect, field, format);
  }
};
