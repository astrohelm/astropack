/* eslint-disable no-unmodified-loop-condition */
'use strict';

const DEFAULT_MAX_LISTENERS = 10;
const kEvents = Symbol('events storage');
const kMaxListeners = Symbol('max listeners count');
EventEmitter.symbols = { kEvents, kMaxListeners };
EventEmitter.on = on;
EventEmitter.once = once;
EventEmitter.defaultMaxListeners = DEFAULT_MAX_LISTENERS;
module.exports = EventEmitter;

function EventEmitter() {
  if (!new.target) return new EventEmitter();
  this[kMaxListeners] = DEFAULT_MAX_LISTENERS;
  this[kEvents] = new Map();
}

EventEmitter.prototype.emit = function (name, ...args) {
  const event = this[kEvents].get(name);
  if (!event) return false;
  event.forEach(listener => listener(...args));
  return true;
};

// prettier-ignore
EventEmitter.prototype.addListener = EventEmitter.prototype.on = function (name, listener) {
  const { [kEvents]: storage, [kMaxListeners]: maxSize } = this;
  var created = storage.get(name), event = created ?? new Set();
  if (!created) storage.set(name, event);
  if (event.size > maxSize) leakWarn(event.size, maxSize);
  event.add(listener), this.emit('newListener', name, listener);
  return this;
};

EventEmitter.prototype.once = function (name, listener) {
  const disable = (...args) => void (this.off(name, disable), listener(...args));
  return this.on(name, disable);
};

EventEmitter.prototype.removeListener = EventEmitter.prototype.off = function (name, listener) {
  const event = this[kEvents].get(name);
  if (event) event.delete(listener);
  this.emit('removeListener', name, listener);
  return this;
};

EventEmitter.prototype.removeAllListeners = EventEmitter.prototype.clear = function (name) {
  name ? this[kEvents].delete(name) : this[kEvents].clear();
  return this;
};

EventEmitter.prototype.listenerCount = function (name) {
  return this[kEvents].get(name)?.size ?? 0;
};

EventEmitter.prototype.eventNames = function () {
  return [...this[kEvents].keys()];
};

EventEmitter.prototype.listeners = function (name) {
  const listeners = this[kEvents].get(name);
  return listeners ? [...listeners] : [];
};

EventEmitter.prototype.getMaxListeners = function () {
  return this[kMaxListeners];
};

EventEmitter.prototype.setMaxListeners = function (n) {
  this[kMaxListeners] = n;
  return this;
};

function once(emitter, name, { signal } = {}) {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) reject(new Error('Aborted'));
    emitter.once(name, (...args) => resolve(args));
    signal?.addEventListener('abort', listener);
    function listener() {
      signal.removeEventListener('abort', listener);
      reject(new Error('Aborted'));
    }
  });
}

async function* on(emitter, name, { signal } = {}) {
  var notAborted = !signal?.aborted;
  if (!notAborted) throw new Error('Aborted');
  while (notAborted) yield await once(emitter, name, { signal });
}

// prettier-ignore
function leakWarn(count, max) {
  return `MaxListenersExceededWarning: Possible EventEmitter memory leak detected.
        ${count} listeners added. Use emitter.setMaxListeners() to increase limit.
        Current maxListenersCount: ${max} HINT: Avoid adding listeners in loops.`;
}
