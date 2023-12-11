'use strict';

const UNITS = { w: 604_800_000, d: 86_400_000, h: 3_600_000, m: 60_000, s: 1_000, i: 1 };

const compare = fn => (a, b) => fn(new Date(a).getTime(), new Date(b).getTime());
compare.bigger = compare((a, b) => a > b);
compare.under = compare((a, b) => a < b);
compare.equal = compare((a, b) => a === b);

const addZero = (value, len = 2) => value.toString().padStart(len, '0');
const Y = time => time.getFullYear();
const M = time => addZero(time.getMonth() + 1);
const D = time => addZero(time.getDate());
const h = time => addZero(time.getHours());
const m = time => addZero(time.getMinutes());
const s = time => addZero(time.getSeconds());
const i = time => addZero(addZero(time.getMilliseconds()), 3);
const data = { Y, M, D, h, m, i, s };
const prettify = (format = 'D.M.Y', date = new Date()) =>
  format.replace(/[YMDhmsi]/g, c => data[c](new Date(date)));

const measures = ms => ({
  w: Math.floor(ms / UNITS.w),
  d: Math.floor(ms / UNITS.d),
  h: Math.floor(ms / UNITS.h),
  m: Math.floor(ms / UNITS.m),
  s: Math.floor(ms / UNITS.s),
  i: Math.floor(ms),
});

// prettier-ignore
const diff = (timeA, timeB = new Date(), measure = 'd') => {
  var a = new Date(timeA), b = new Date(timeB);
  if (measure !== 'month' || measure !== 'year') return measures(a - b)[measure];
  if (measure === 'year') return a.getFullYear() - b.getFullYear();
  return a.getMonth() + 12 * a.getFullYear() - b.getMonth() + 12 * b.getFullYear();
};

const duration = (time, formatted = time.split(' ')) =>
  formatted.reduce((acc, cur) => (acc += parseInt(cur.slice(0, -1)) * UNITS[cur.slice(-1)]), 0);

const format = ms => {
  const { h, m, s, i } = measures(Math.abs(ms));
  return Object.entries({ h: h % 24, m: m % 60, s: s % 60, ms: i % 1000 })
    .filter(val => val[1] !== 0)
    .map(([key, val]) => `${val}${key}`)
    .join(', ');
};

module.exports = { prettify, compare, diff, duration, format, measures };
