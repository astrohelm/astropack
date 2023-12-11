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
  const { LinkedList } = structs;
  const list = new LinkedList('First node', 'Second node');
  list.push('Third node');
  assert.strictEqual(list.indexOf('First node'), 0);
  assert.strictEqual(list.indexOf('Third node'), 2);
  assert.strictEqual(list.length, 3);
  list.pop();
  list.delete(0);
  assert.strictEqual(list.indexOf('Second node'), 0);
  list.shift();
  list.push('First node');
  list.push('Second node');
  list.push('Third node');
  assert.strictEqual(list.indexOf('First node'), 0);
  assert.strictEqual(list.indexOf('Third node'), 2);
  assert.strictEqual(list.length, 3);
  list.deleteValue('First node');
  assert.strictEqual(list.length, 2);
  assert.strictEqual(list.indexOf('First node'), -1);
  list.length = 10;
  assert.strictEqual(list.length, 10);
  assert.strictEqual(list[10], undefined);
  assert.strictEqual(list.at(1), 'Third node');
  list[5] = 'Fith node';
  assert.strictEqual(list.at(5), 'Fith node');
  assert.strictEqual(list.reduce((acc, v) => (acc.push(v), acc), []).length, 10);
  const result = list.reduce((acc, v) => (acc.push(v), acc), []);
  assert.strictEqual(result[5], 'Fith node');
  assert.strictEqual(list.filter(v => v).length, 3);
});

test('Linked list chaining', () => {
  const a = new astropack.structs.LinkedList(1, 2, 3, 4);
  const b = new astropack.structs.LinkedList(5, 6, 7, 8);
  b.chain('before', a);
  assert.strictEqual([...b].length, 8);
  assert.strictEqual(b.length, 4);
});

test('EventEmitter', async () => {
  const ee = new astropack.structs.EventEmitter();
  assert.strictEqual(ee.getMaxListeners(), 10);
  let [on, once] = [0, 0];

  ee.on('name1', (a, b) => {
    assert.strictEqual(a, 'hello');
    assert.strictEqual(b, 'world');
    on++;
  });

  ee.once('name1', data => {
    assert.strictEqual(data, 'hello');
    once++;
  });

  ee.emit('name1', 'hello', 'world');
  ee.emit('name1', 'hello', 'world');

  assert.strictEqual(on, 2);
  assert.strictEqual(once, 1);

  assert.strictEqual(ee.listenerCount('name1'), 1);
  assert.strictEqual(ee.listenerCount('name2'), 0);

  let count = 0;
  const fn = () => void count++;
  ee.on('name1', fn);
  ee.emit('name1', 'hello', 'world');
  assert.strictEqual(count, 1);

  assert.strictEqual(ee.listenerCount('name1'), 2);
  ee.off('name1', fn);
  assert.strictEqual(ee.listenerCount('name1'), 1);

  ee.emit('name1', 'hello', 'world');
  assert.strictEqual(count, 1);

  ee.clear('name1');
  assert.strictEqual(ee.listenerCount('name1'), 0);

  setTimeout(() => {
    ee.emit('delayed', 'hello', 'world');
  }, 50);

  const EventEmitter = astropack.structs.EventEmitter;
  const result = await EventEmitter.once(ee, 'delayed');
  assert.strictEqual(result[0], 'hello');
  assert.strictEqual(result[1], 'world');

  ee.clear();
  assert.strictEqual(ee.listenerCount('delayed'), 0);

  const controller = new AbortController();
  let counter = 0;
  let timer = null;
  const callback = () => {
    if (counter === 3) clearInterval(timer), controller.abort();
    counter++;
    ee.emit('test', 'value', counter);
  };
  timer = setInterval(callback, 50);

  try {
    for await (var res of EventEmitter.on(ee, 'test', { signal: controller.signal })) {
      assert.strictEqual(typeof res[0], 'string');
      assert.strictEqual(typeof res[1], 'number');
    }
  } catch (e) {
    assert.strictEqual(e.message, 'Aborted');
  }
});
