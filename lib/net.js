'use strict';

const METHOD = 'POST';
const MIME = 'application/json';
const callout = (url, { headers = {}, ...options }) => {
  const custom = { 'Content-Type': MIME, ...headers };
  const method = options.header ?? METHOD;
  if (options.body) custom['Content-Length'] = Buffer.byteLength(options.body);
  return fetch(url, { method, headers: custom, ...options }).then(res => {
    if (res.status < 300) return res.json();
    throw new Error(`HTTP status code ${res.status} for ${method} ${url}`);
  });
};

const recieve = async stream => {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
};

const ipToInt = ip => {
  if (typeof ip !== 'string') return Number.NaN;
  return ip.split('.').reduce((acc, v) => acc * 256 + +v, 0);
};

const INVALID_IP = 'Invalid IPv4 address';
const ipFromInt = ip => {
  if (!Number.isInteger(ip) || ip < 0 || ip > 0xffffffff) throw new Error(INVALID_IP);
  for (var i = 0, arr = new Array(4); i < 4; i++) arr[i] = (ip >>> (8 * (3 - i))) & 0xff;
  return arr.join('.');
};

const ip4rse = ip => (typeof ip === 'string' ? ipToInt(ip) : ipFromInt(ip));
module.exports = { callout, recieve, ip4rse };
