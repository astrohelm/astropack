var exports = {};

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

var time$1 = { prettify, compare, diff, duration, format, measures };

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
  if (!x.prototype) return x.construcor.name === 'AsyncFunction' ? 'async' : 'arrow';
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

var utils$1 = { equals, prettyBytes, isFunction, safe };

const inRange = (x, min, max) => x >= min && x <= max;
const firstLetterUp = s => s.charAt(0).toUpperCase() + s.slice(1);
const toLower = s => s.toLowerCase();

const cases$1 = {
  isConstant: s => s === s.toUpperCase(),
  isFirstUpper: s => !!s && inRange(s[0], 'A', 'Z'),
  isFirstLower: s => !!s && inRange(s[0], 'a', 'z'),
  isFirstLetter: s => cases$1.isFirstUpper(s) || cases$1.isFirstLower(s),
  toCamel: separator => s => {
    const words = s.split(separator);
    const first = words.length > 0 ? words.shift().toLowerCase() : '';
    return first + words.map(toLower).map(firstLetterUp).join('');
  },
  fromCamel: separator => s => {
    const first = s.match(/^[a-z][^A-Z]*/)[0];
    const words = s.match(/([A-Z][^A-Z]*)/g).map(s => s.toLowerCase());
    return first + separator + words.join(separator);
  },
};

cases$1.spinalToCamel = cases$1.toCamel('-');
cases$1.camelToSpinal = cases$1.fromCamel('-');
cases$1.camelToSnake = cases$1.fromCamel('_');
cases$1.snakeToCamel = cases$1.toCamel('_');

var cases_1 = cases$1;

const cases = cases_1;

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

var string$1 = { from, to, jsonParse, template, case: cases };

const kConcurrncy = Symbol('concurrncy');
const kTimeout = Symbol('timeout');
const kSize = Symbol('size');
var semaphore = Semaphore;

function Semaphore(concurrency, size = 0, timeout = 0) {
  if (!new.target) return new Semaphore(concurrency, size, timeout);
  this[kConcurrncy] = concurrency;
  this[kTimeout] = timeout;
  this[kSize] = size;
  this.counter = concurrency;
  this.empty = true;
  this.queue = [];
}

const FULL_SEMAPHORE = 'Semaphore queue is full';
Semaphore.prototype.enter = function () {
  const { [kConcurrncy]: concurrency, [kSize]: size, [kTimeout]: timeout } = this;
  return new Promise((resolve, reject) => {
    if (this.counter > 0) {
      this.counter--;
      this.empty = false;
      return void resolve();
    }

    if (this.queue.length >= size) return void reject(new Error(FULL_SEMAPHORE));
    const waiting = { resolve, timer: null };
    waiting.timer = setTimeout(() => {
      waiting.resolve = null;
      this.queue.shift();
      this.empty = this.queue.length === 0 && this.counter === concurrency;
      reject(new Error('Semaphore timeout'));
    }, timeout);
    this.queue.push(waiting);
    this.empty = false;
  });
};

Semaphore.prototype.leave = function () {
  const { [kConcurrncy]: concurrency } = this;
  if (this.queue.length === 0) {
    this.counter++;
    this.empty = this.counter === concurrency;
    return;
  }

  const { resolve, timer } = this.queue.shift();
  clearTimeout(timer), resolve && setTimeout(resolve, 0);
  this.empty = this.queue.length === 0 && this.counter === concurrency;
};

/* eslint-disable no-unmodified-loop-condition */

const kHead = Symbol('head');
const kTail = Symbol('tail');
const kLength = Symbol('length');
const kSelect = Symbol('select');
const kValueSelect = Symbol('select by value');
const kAdd = Symbol('add');
const kChain = Symbol('chain');
var linked = LinkedList;
LinkedList.symbols = { kHead, kTail, kLength, kSelect, kValueSelect, kAdd, kChain };
LinkedList.isList = sample => sample.constructor?.name === 'LinkedList';
LinkedList.of = (...args) => new LinkedList(...args);
LinkedList.from = args => new LinkedList(...args);

function LinkedList(...values) {
  if (!new.target) return new LinkedList(...values);
  this[kChain] = { before: null, after: null };
  this[kHead] = null;
  this[kTail] = null;
  this[kLength] = 0;

  values.length && this[kAdd](false, values);
  return new Proxy(this, {
    get: (target, prop, reciever) => {
      if (typeof prop === 'symbol' || isNaN(+prop)) return Reflect.get(target, prop, reciever);
      return this[kSelect](+prop)?.value;
    },
    set: (t, prop, value, reciever) => {
      if (typeof prop === 'symbol' || isNaN(+prop)) return Reflect.set(t, prop, value, reciever);
      for (var index = +prop; index < 0; index += this[kLength]);
      if (index > this[kLength] - 1) t.length = index;
      this[kSelect](index).value = value;
      return true;
    },
  });
}

Object.defineProperty(LinkedList.prototype, 'length', {
  enumerable: true,
  get() {
    return this[kLength];
  },
  set(v) {
    var k = this[kLength] < v ? 'push' : 'shift';
    if (typeof v !== 'number') throw new Error('Linked List length must be a number');
    while (this[kLength] - v) this[k](undefined);
  },
});

LinkedList.prototype[Symbol.iterator] = function* () {
  const { before, after } = this[kChain];
  if (before) yield* before;
  var current = this[kHead];
  while (current) {
    yield current.value;
    current = current.next;
  }
  if (after) yield* after;
};

LinkedList.prototype[Symbol.toPrimitive] = function (hint) {
  if (hint === 'number') return this[kLength];
  return JSON.stringify([...this]);
};

// prettier-ignore
LinkedList.prototype[kSelect] = function (index) {
  const { [kHead]: head, [kTail]: tail, [kLength]: length } = this;
  while (index < 0) index = length + index;
  if (index >= length) return null;
  if (index === length - 1) return tail;
  if (index === 0) return head;
  if (length / 2 > index) var curr = head, key = 'next', steps = index;
  else curr = tail, key = 'prev', steps = length - index - 1;
  for (var i = 0; i < steps; i += 1) curr = curr[key];
  return curr;
};

LinkedList.prototype[kValueSelect] = function (value) {
  for (var i = 0, curr = this[kHead]; i < this[kLength]; ++i, curr = curr.next) {
    if (curr.value === value) return [curr, i];
  }
  return [null, -1];
};

// prettier-ignore
LinkedList.prototype[kAdd] = function (flag, elements) {
  if (!elements.length) return this[kLength];
  if (this[kHead] === null) {
    this[kTail] = this[kHead] = new Node(elements[0]);
    elements.length > 1 && this[kAdd](flag, elements.slice(1));
    return ++this[kLength];
  }
  if (flag) var sourceKey = kHead, keyA = 'next', keyB = 'prev';
  else sourceKey = kTail, keyA = 'prev', keyB = 'next';
  var source = this[sourceKey];
  elements.forEach(v => {
    const node = new Node(v);
    node[keyA] = source;
    source[keyB] = node;
    source = node;
  });
  this[kLength] += elements.length;
  this[sourceKey] = source;
  return this[kLength];
};

// prettier-ignore
LinkedList.prototype.delete = function (index) {
  if (index < 0 || index >= this[kLength]) throw new Error('Invalid index');
  if (index === 0 || index === this[kLength] - 1) {
    var value = this[index ? kHead : kTail].value;
    if (this[kTail] === this[kHead]) this[kTail] = this[kHead] = null;
    else if (index === 0) this[kHead].next.prev = null, this[kHead] = this[kHead].next;
    else this[kTail].prev.next = null, this[kTail] = this[kTail].prev;
    return this[kLength]--, value;
  }

  const curr = this[kSelect](index);
  if (curr.prev) curr.prev.next = curr.next;
  if (curr.next) curr.next.prev = curr.prev;
  return this[kLength]--, curr.value;
};

// prettier-ignore
LinkedList.prototype.deleteValue = function (value) {
  const [curr, i] = this[kValueSelect](value);
  if (!curr) return i;
  if (i === 0) {
    var head = this[kHead];
    head.next.prev = null;
    this[kHead] = head.next;
  } else if (i === length - 1) {
    var tail = this[kTail];
    tail.prev.next = null;
    this[kTail] = tail.prev;
  } else {
    if (curr.prev) curr.prev.next = curr.next;
    if (curr.next) curr.next.prev = curr.prev;
  }
  return this[kLength]--, i;
};

LinkedList.prototype.push = function (...args) {
  return this[kAdd](false, args);
};

LinkedList.prototype.at = function (i) {
  return this[kSelect](i).value;
};

LinkedList.prototype.indexOf = function (value) {
  return this[kValueSelect](value)[1];
};

LinkedList.prototype.includes = function (value) {
  return this[kValueSelect](value)[1] !== -1;
};

LinkedList.prototype.with = function (i, v) {
  this[kSelect](i).value = v;
};

LinkedList.prototype.fill = function (v) {
  for (var item of this) item.value = v;
  return this;
};

LinkedList.prototype.find = function (callback) {
  var i = -1;
  for (var value of this) if (callback(value, ++i, this)) return value;
  return null;
};

LinkedList.prototype.unshift = function (...args) {
  return this[kAdd](true, args);
};

LinkedList.prototype.forEach = function (callback) {
  var i = -1;
  for (var value of this) callback(value, ++i, this);
};

// prettier-ignore
LinkedList.prototype.reduce = function (callback, init) {
  var result = init, i = -1;
  for (var value of this) result = callback(result, value, ++i, this);
  return result;
};

//prettier-ignore
LinkedList.prototype.map = function (callback) {
  var result = new LinkedList(), i = -1;
  for (var value of this) result.push(callback(value, ++i, this));
  return result;
};

// prettier-ignore
LinkedList.prototype.filter = function (callback) {
  var result = new LinkedList(), i = -1;
  for (var value of this) callback(value, ++i, this) ? result.push(value) : 0;
  return result;
};

LinkedList.prototype.some = function (callback) {
  var i = -1;
  for (var value of this) if (callback(value, ++i, this)) return value;
  return null;
};

LinkedList.prototype.every = function (callback) {
  var i = -1;
  for (var value of this) if (!callback(value, ++i, this)) return false;
  return true;
};

LinkedList.prototype.pop = function () {
  return this.delete(this[kLength] - 1);
};

LinkedList.prototype.shift = function () {
  return this.delete(0);
};

LinkedList.prototype.chain = function (name, list) {
  this[kChain][name] = list;
};

LinkedList.prototype.unchain = function (name) {
  this[kChain][name] = null;
};

// prettier-ignore
LinkedList.prototype.toJSON = LinkedList.prototype.toString = function () {
  return [...this];
};

function Node(value) {
  this.value = value;
  this.next = null;
  this.prev = null;
}

/* eslint-disable no-unmodified-loop-condition */

const DEFAULT_MAX_LISTENERS = 10;
const kEvents = Symbol('events storage');
const kMaxListeners = Symbol('max listeners count');
EventEmitter.symbols = { kEvents, kMaxListeners };
EventEmitter.on = on;
EventEmitter.once = once;
EventEmitter.defaultMaxListeners = DEFAULT_MAX_LISTENERS;
var events = EventEmitter;

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

const kFactory = Symbol('factory');
const kStorage = Symbol('storage');
const DEFAULT_FACTORY = () => null;
var pool = Pool;
Pool.symbols = { kFactory, kStorage };

function Pool(factory = DEFAULT_FACTORY) {
  this[kFactory] = factory;
  this[kStorage] = [];
}

Pool.prototype.put = function (value) {
  this[kStorage].push(value);
};

Pool.prototype.pop = function () {
  const storage = this[kStorage];
  return storage.length ? storage.pop() : this[kFactory]();
};

var structs$1 = {
  Semaphore: semaphore,
  LinkedList: linked,
  EventEmitter: events,
  Pool: pool,
};

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

var object$1 = {
  methods,
  properties,
  entries,
};

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
var net$1 = { callout, recieve, ip4rse };

var time = exports.time = time$1;
var utils = exports.utils = utils$1;
var string = exports.string = string$1;
var structs = exports.structs = structs$1;
var object = exports.object = object$1;
var net = exports.net = net$1;

export { exports as default, net, object, string, structs, time, utils };
