import chalk from 'chalk';
import { isEmpty } from 'lodash';
import winston from 'winston';

import { getLoggerFormat } from './config';
import { LoggerOptions } from './logger';

const DEFAULT_DELIMITER = '|';

const colorize = {};

export const getFormat = (format?: LoggerOptions['format']) => {
  const configFormat = format || getLoggerFormat();
  let logFormat: winston.Logform.Format;
  switch (configFormat) {
    case 'console':
      logFormat = winston.format.combine(consoleFormat);
      break;
    case 'logfmt':
      logFormat = logfmtFormat;
      break;
    case 'delimiter':
      logFormat = winston.format.combine(escapeFormat, delimiterFormat);
      break;
    case 'json':
      logFormat = winston.format.combine(winston.format.json({ deterministic: false }));
      break;
    default:
      return winston.format.combine(format as winston.Logform.Format);
  }
  return winston.format.combine(sortFormat, logFormat);
};

export const colorFormat: winston.Logform.Format = winston.format((info) => {
  Object.entries(info).forEach(([k, v]) => {
    const level = info['level'];
    if (colorize[k]) {
      info[k] = colorize[k](v);
      return;
    }
    if (colorize[level]?.[k]) {
      info[k] = colorize[level][k](v);
      return;
    }
  });
  return info;
})();

export const stripColorFormat: winston.Logform.Format = winston.format((info) => {
  Object.entries(info).forEach(([k, v]) => {
    if (typeof v !== 'string') {
      return;
    }
    const regex = new RegExp(`\\x1b\\[\\d+m`, 'g');
    info[k] = v.replace(regex, '');
  });
  return info;
})();

// https://brandur.org/logfmt
export const logfmtFormat: winston.Logform.Format = winston.format.printf((info) =>
  Object.entries(info)
    .map(([k, v]) => {
      if (typeof v === 'object') {
        try {
          v = JSON.stringify(v);
        } catch (error) {
          v = String(v);
        }
      }
      if (v === undefined || v === null) {
        v = '';
      }
      return `${k}=${v}`;
    })
    .join(' '),
);

export const consoleFormat: winston.Logform.Format = winston.format.printf((info) => {
  const keys = ['level', 'timestamp', 'message'];
  Object.entries(info).forEach(([k, v]) => {
    if (typeof v === 'object') {
      if (isEmpty(v)) {
        info[k] = '';
        return;
      }
      try {
        info[k] = JSON.stringify(v);
      } catch (error) {
        info[k] = String(v);
      }
    }
    if (v === undefined || v === null) {
      info[k] = '';
    }
  });

  const tags = Object.entries(info)
    .filter(([k, v]) => !keys.includes(k) && v)
    .map(([k, v]) => `${k}=${v}`)
    .join(' ');

  const level = info.level.padEnd(5, ' ');
  // in our case, info.message is always a string.
  const message = (info.message as string).padEnd(44, ' ');
  const color =
    {
      error: chalk.red,
      warn: chalk.yellow,
      info: chalk.green,
      debug: chalk.blue,
    }[info.level] || chalk.white;
  const colorized = message.startsWith('Executing')
    ? color(`${info.timestamp} [${level}]`) + ` ${message}`
    : color(`${info.timestamp} [${level}] ${message}`);
  return `${colorized} ${tags}`;
});

export const delimiterFormat = winston.format.printf((info) =>
  Object.entries(info)
    .map(([, v]) => {
      if (typeof v === 'object') {
        try {
          return JSON.stringify(v);
        } catch (error) {
          return String(v);
        }
      }
      return v;
    })
    .join(DEFAULT_DELIMITER),
);

export const escapeFormat: winston.Logform.Format = winston.format((info) => {
  let { message } = info;
  if (typeof message === 'string' && message.includes(DEFAULT_DELIMITER)) {
    message = message.replace(/"/g, '\\"');
    message = `"${message}"`;
  }
  return { ...info, message };
})();

export const sortFormat = winston.format((info) => ({ level: info.level, ...info }))();
