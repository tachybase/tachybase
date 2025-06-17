'use strict';

module.exports = function (stamp) {
  return {
    allow: !stamp.a.startsWith('arm'),
    deployFilesFrom: ['phantomjs-prebuilt'],
  };
};
