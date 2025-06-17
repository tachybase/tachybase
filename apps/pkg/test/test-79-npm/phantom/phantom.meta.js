'use strict';

module.exports = function (stamp) {
  return {
    allow: !stamp.a.startsWith('arm'),
    deployFilesFrom: ['phantom', 'phantomjs-prebuilt'],
  };
};
