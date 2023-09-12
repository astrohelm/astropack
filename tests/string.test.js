'use strict';

const test = require('node:test');
const assert = require('node:assert');
const astropack = require('..');
const { string } = astropack;

test('String format', () => {
  const { to, from } = string;
  const example = { very: { deep: { object: 'model' } } };
  assert.strictEqual(to(example), '{"very":{"deep":{"object":"model"}}}');
  assert.strictEqual(to(1), '1');
  assert.strictEqual(from('false'), false);
  assert.strictEqual(from('undefined'), undefined);
  assert.strictEqual(from('null'), null);
  assert.strictEqual(from('12.23'), 12.23);
  assert.strictEqual(from('test'), 'test');
  assert.notStrictEqual(from(to(example)), example);
});

test('JSON parser', () => {
  const { jsonParse } = string;
  assert.strictEqual(jsonParse('{'), null);
  assert.strictEqual(jsonParse('{ "test": true }').test, true);
});

test('Template', () => {
  const { template } = string;
  const temp = template`Hello ${'user'} !`;
  assert.strictEqual(temp({ user: 'astro' }), 'Hello astro !');
});

test('Cases', () => {
  const { case: cases } = string;
  assert.strictEqual(cases.isConstant('GLOBAL_CONSTANT'), true);
  assert.strictEqual(cases.isFirstLower('gLOBAL_CONSTANT'), true);
  assert.strictEqual(cases.isFirstLetter('gLOBAL_CONSTANT'), true);
  assert.strictEqual(cases.isFirstLetter('1'), false);
  assert.strictEqual(cases.spinalToCamel('test-this-text'), 'testThisText');
  assert.strictEqual(cases.camelToSpinal('testThisText'), 'test-this-text');
  assert.strictEqual(cases.camelToSnake('testThisText'), 'test_this_text');
  assert.strictEqual(cases.snakeToCamel('test_this_text'), 'testThisText');
  assert.strictEqual(cases.toCamel('/')('test/this/text'), 'testThisText');
  assert.strictEqual(cases.fromCamel('/')('testThisText'), 'test/this/text');
});
