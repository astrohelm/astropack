'use strict';

const test = require('node:test');
const assert = require('node:assert');
const astrokit = require('..');
const { time } = astrokit;
const TODAY = new Date();
const TOMORROW = new Date(new Date().setDate(TODAY.getDate() + 1));

test('Dates comparison', () => {
  const { compare } = time;
  assert.strictEqual(compare.bigger(TOMORROW, TODAY), true);
  assert.strictEqual(compare.under(TOMORROW, TODAY), false);
  assert.strictEqual(compare.equal(TODAY, TODAY), true);
  assert.strictEqual(compare((a, b) => a === b)(TODAY, TODAY), true);
});

test('Dates prettify', () => {
  const { prettify } = time;
  assert.strictEqual(prettify().length, 10);
  assert.strictEqual(prettify('Y-M-D h:m:s.i').length, 23);
  assert.strictEqual(prettify('h', new Date()).length, 2);
});

test('Measures', () => {
  const { measures } = time;
  console.log(measures(new Date()));
  assert.strictEqual(measures(1).i, 1);
  assert.strictEqual(measures(1_000).s, 1);
  assert.strictEqual(measures(100_000).m, 1);
  assert.strictEqual(measures(10_000_000).h, 2);
  assert.strictEqual(measures(10_000_000).h, 2);
  assert.strictEqual(measures(100_000_000).d, 1);
  assert.strictEqual(measures(1_000_000_000).w, 1);
});

test('Date measure difference', () => {
  const { diff } = time;
  assert.strictEqual(diff(TODAY, TODAY), 0);
  assert.strictEqual(diff(TODAY, TOMORROW), -1);
  assert.strictEqual(diff(TODAY, TOMORROW, 'h'), -24);
  assert.strictEqual(diff(TODAY, TOMORROW, 'm'), -24 * 60);
});

test('Duration', () => {
  const { duration } = time;
  assert.strictEqual(duration('1s'), 1000);
  assert.strictEqual(duration('1m'), 60000);
  assert.strictEqual(duration('1m 1s'), 61000);
  assert.strictEqual(duration('1m 1s 1i'), 61001);
  assert.strictEqual(duration('1h 1m 1s 1i'), 60000 * 61 + 1001);
  assert.strictEqual(duration('1d 1h 1m 1s 1i'), 25 * 60000 * 60 + 61001);
  assert.strictEqual(duration('1w 1m 1s 1i'), 7 * 24 * 60000 * 60 + 61001);
});

test('Format', () => {
  const { format } = time;
  assert.strictEqual(format(1000), '1s');
  assert.strictEqual(format(1100), '1s, 100ms');
  assert.strictEqual(format(61100), '1m, 1s, 100ms');
  assert.strictEqual(format(60 * 60000 + 1), '1h, 1ms');
});
