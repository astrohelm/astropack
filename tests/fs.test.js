'use strict';

const test = require('node:test');
const assert = require('node:assert');
const path = require('node:path');
const astropack = require('..');
const { fs } = astropack;

test('Fs file', () => {
  const { file } = fs;
  assert.strictEqual(file.name('/path/to/file.js'), 'file');
  assert.strictEqual(file.ext('/path/to/file.js'), 'js');
  assert.strictEqual(file.ext('/path/to/js'), '');
  assert.strictEqual(file.ext('/path/to/.js'), '');
  assert.strictEqual(file.dir('/path/to/.js'), '/path/to');
});

test('Fs dir', async () => {
  const { dir } = fs;
  let check = await dir.check(path.join(__dirname, '../tests'));
  assert.strictEqual(check, true);
  check = await dir.ensure(path.join(__dirname, '../tests'));
  assert.strictEqual(check, true);
});
