'use strict';

const test = require('node:test');
const assert = require('node:assert');
const astropack = require('..');
const { utils } = astropack;

test('Equality', () => {
  const { equals } = utils;
  assert.strictEqual(equals(1, 1), true);
  assert.strictEqual(equals('test', 'test'), true);
  assert.strictEqual(equals(![], false), true);
  assert.strictEqual(equals(undefined, undefined), true);
  assert.strictEqual(equals(null, null), true);
  assert.strictEqual(equals({ a: 1 }, { a: 1 }), true);
  assert.strictEqual(equals([1, 2, [3]], [1, 2, [3]]), true);
  assert.strictEqual(equals({ a: { b: 'c' } }, { a: { b: 'c' } }), true);
});

test('Bytes prettier', () => {
  const { prettyBytes } = utils;
  assert.strictEqual(prettyBytes(1), '1 B');
  assert.strictEqual(prettyBytes(1000), '1 KB');
  assert.strictEqual(prettyBytes(1100), '1.1 KB');
});
