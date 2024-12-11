const customColor = {
  red: '#fc9792',
  magenta: '#ffa3cc',
  volcano: '#ffb38b',
  orange: '#ffcf86',
  gold: '#ffe184',
  lime: '#e7ff84',

  green: '#aee884',
  cyan: '#7ce5d9',
  blue: '#86c3ff',
  geekblue: '#a3bfff',
  purple: '#cda3f6',
  default: '#d4d4d4',
};

export const getMobileColor = (color: string) => customColor[color];
