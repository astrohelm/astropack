'use strict';

const equals = (a, b) => {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
  if (a === null || a === undefined || b === null || b === undefined) return false;
  if (a.prototype !== b.prototype) return false;
  const keys = Object.keys(a);
  if (keys.length !== Object.keys(b).length) return false;
  return keys.every(k => equals(a[k], b[k]));
};

const prettyBytes = (num, precision = 3, addSpace = true) => {
  const UNITS = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  if (Math.abs(num) < 1) return num + (addSpace ? ' ' : '') + UNITS[0];
  const exponent = Math.min(Math.floor(Math.log10(num < 0 ? -num : num) / 3), UNITS.length - 1);
  const n = Number(((num < 0 ? -num : num) / 1000 ** exponent).toPrecision(precision));
  return (num < 0 ? '-' : '') + n + (addSpace ? ' ' : '') + UNITS[exponent];
};

function isFunction(x) {
  if (typeof x !== 'function') return null;
  if (!x.prototype) return x.constructor.name === 'AsyncFunction' ? 'async' : 'arrow';
  const descriptor = Object.getOwnPropertyDescriptor(x, 'prototype');
  return descriptor.writable ? 'function' : 'class';
}

// prettier-ignore
const safe = fn => (...args) => {
  try {
    return [null, fn(...args)];
  } catch (err) {
    return [err, null];
  }
};

module.exports = { equals, prettyBytes, isFunction, safe };
