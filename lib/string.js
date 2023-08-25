'use strict';

const template = (strings, ...keys) => {
  const build = values => (acc, key, i) => (acc.push(values[key], strings[i + 1]), acc);
  return values => keys.reduce(build(values), [strings[0]]).join('');
};

const jsonParse = buffer => {
  if (buffer.length === 0) return null;
  try {
    return JSON.parse(buffer);
  } catch {
    return null;
  }
};

const to = value => {
  if (typeof value === 'string') return value;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
};

const from = string => {
  const descriptors = { false: false, true: true, null: null, undefined };
  if (string in descriptors) return descriptors[string];
  if (!isNaN(+string)) return Number(string);
  return jsonParse(string) ?? string;
};

module.exports = { from, to, jsonParse, template };
