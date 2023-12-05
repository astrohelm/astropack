'use strict';

const methods = iface => {
  const names = [];
  for (var name in iface) {
    if (typeof iface[name] !== 'function') continue;
    names.push(name);
  }
  return names;
};

const properties = iface => {
  const names = [];
  for (var name in iface) {
    if (typeof iface[name] === 'function') continue;
    names.push(name);
  }
  return names;
};

const entries = sample => {
  if (Array.isArray(sample) && sample[0]?.length === 2) return sample;
  return sample?.constructor.name === 'Map' ? [...sample.entries()] : Object.entries(sample);
};

module.exports = {
  methods,
  properties,
  entries,
};
