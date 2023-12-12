'use strict';

const test = require('node:test');
const assert = require('node:assert');
const astropack = require('..');
const { net } = astropack;

const API_URL = 'https://jsonplaceholder.typicode.com/todos';
test('Fs file', async () => {
  const { callout } = net;
  var res = await callout(API_URL + '/1', { method: 'GET' });
  assert.strictEqual(typeof res.id, 'number');
  assert.strictEqual(typeof res.title, 'string');

  const body = { title: 'test', body: 'test', userId: 1 };
  res = await net.callout(API_URL, { body: JSON.stringify(body) });
  assert.strictEqual(res.title, body.title);
});

test('Fs file', async () => {
  const { ip4rse } = net;
  const cases = ['192.168.1.1', '127.0.0.1'];
  cases.forEach(ip => assert.strictEqual(ip4rse(ip4rse(ip)), ip));
});
