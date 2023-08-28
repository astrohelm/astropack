'use strict';

const fsp = require('node:fs').promises;
const path = require('node:path');

const dir = {
  check: async path => {
    const stats = await fsp.stat(path).catch(() => null);
    if (!stats) return false;
    return stats.isDirectory();
  },
  ensure: async path => {
    const alreadyExists = await dir.check(path);
    if (alreadyExists) return true;
    return fsp.mkdir(path).then(...[() => true, () => false]);
  },
};

const file = {
  ext: name => path.extname(name).replace('.', '').toLowerCase(),
  name: name => path.basename(name.substr(0, name.lastIndexOf('.'))),
};

module.exports = { dir, file };
