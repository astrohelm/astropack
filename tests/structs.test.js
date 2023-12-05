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

test('Pool', () => {
  const factory = () => 'Empty value';
  const pool = new structs.Pool(factory);
  assert.strictEqual(pool.pop(), 'Empty value');
  pool.put('My value');
  assert.strictEqual(pool.pop(), 'My value');
});

test('Linked list', () => {
  const list = new structs.LinkedList();
  list.push('First node');
  list.push('Second node');
  list.push('Third node');
  assert.strictEqual(list.indexOf('First node'), 0);
  assert.strictEqual(list.indexOf('Third node'), 2);
  assert.strictEqual(list.size, 3);
  list.pop();
  list.delete(0);
  assert.strictEqual(list.indexOf('Second node'), 0);
  list.shift();
  list.push('First node');
  list.push('Second node');
  list.push('Third node');
  assert.strictEqual(list.indexOf('First node'), 0);
  assert.strictEqual(list.indexOf('Third node'), 2);
  assert.strictEqual(list.size, 3);
  list.deleteValue('First node');
  assert.strictEqual(list.size, 2);
  assert.strictEqual(list.indexOf('First node'), -1);
  list.size = 10;
  assert.strictEqual(list.size, 10);
  assert.strictEqual(list[10], undefined);
  assert.strictEqual(list.at(1), 'Third node');
});
