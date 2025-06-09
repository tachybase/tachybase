'use strict';

const { findPhoneNumbersInText } = require('libphonenumber-js');

const res = findPhoneNumbersInText(
  `
    For tech support call +7 (800) 555-35-35 internationally
    or reach a local US branch at (213) 373-4253 ext. 1234.
  `,
  'US',
);

console.log(res[0].number.nationalNumber);
