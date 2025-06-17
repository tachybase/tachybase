#!/usr/bin/env node

'use strict';

const assert = require('node:assert');
const fetch = require('@yao-pkg/pkg-fetch');
const items = [];

// eslint-disable-next-line no-unused-vars
function nodeRangeToNodeVersion(nodeRange) {
  assert(nodeRange.startsWith('node'));
  return 'v' + nodeRange.slice(4);
}

const platformsToTest = ['win', 'linux', 'macos'];

for (const platform of platformsToTest) {
  const nodeRanges = ['node18', 'node20', 'node22'];
  for (const nodeRange of nodeRanges) {
    const archs = ['x64'];
    if (platform === 'linux' || platform === 'macos') archs.push('arm64');
    for (const arch of archs) {
      items.push({ nodeRange, platform, arch });
    }
  }
}

let p = Promise.resolve();
items.forEach((item) => {
  p = p.then(() => fetch.need(item));
});

p.catch((error) => {
  if (!error.wasReported) console.log(`> ${error}`);
  process.exit(2);
});
