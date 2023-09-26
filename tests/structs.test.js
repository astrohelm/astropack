'use strict';

const test = require('node:test');
const assert = require('node:assert');
const astropack = require('..');
const { structs } = astropack;

const CONCURRENCY = 3;
const QUEUE_SIZE = 4;
const TIMEOUT = 1500;

test('Semaphore custom', async () => {
  const semaphore = new structs.Semaphore(CONCURRENCY, QUEUE_SIZE, TIMEOUT);
  assert.strictEqual(semaphore.empty, true);
  await semaphore.enter();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 1);
  await semaphore.enter();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 2);
  await semaphore.enter();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 3);
  try {
    await semaphore.enter();
    assert.ok(0);
  } catch (err) {
    assert.ok(1);
  }
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 3);
  semaphore.leave();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 2);
  semaphore.leave();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 1);
  semaphore.leave();
  assert.strictEqual(semaphore.counter, CONCURRENCY);
  assert.strictEqual(semaphore.empty, true);
});

test('Semaphore default', async () => {
  const semaphore = new structs.Semaphore(CONCURRENCY);
  assert.strictEqual(semaphore.empty, true);
  await semaphore.enter();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 1);
  await semaphore.enter();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 2);
  await semaphore.enter();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 3);
  try {
    await semaphore.enter();
    assert.ok(0);
  } catch (err) {
    assert.ok(1);
  }
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 3);
  semaphore.leave();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 2);
  semaphore.leave();
  assert.strictEqual(semaphore.empty, false);
  assert.strictEqual(semaphore.counter, CONCURRENCY - 1);
  semaphore.leave();
  assert.strictEqual(semaphore.counter, CONCURRENCY);
  assert.strictEqual(semaphore.empty, true);
});
