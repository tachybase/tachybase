'use strict';

const home = require('../home.js');

module.exports = function (stamp) {
  return {
    allow: home(stamp),
    deployFilesFrom: ['leveldown'],
  };
};
