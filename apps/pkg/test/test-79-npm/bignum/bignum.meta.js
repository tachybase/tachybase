'use strict';

const home = require('../home.js');

module.exports = function (stamp) {
  return {
    allow: home(stamp),
    note: 'requires C:\\OpenSSL-Win64\\lib\\libeay32.lib',
  };
};
