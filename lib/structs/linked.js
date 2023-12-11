/* eslint-disable no-unmodified-loop-condition */
'use strict';

const kHead = Symbol('head');
const kTail = Symbol('tail');
const kLength = Symbol('length');
const kSelect = Symbol('select');
const kValueSelect = Symbol('select by value');
const kAdd = Symbol('add');
const kChain = Symbol('chain');
module.exports = LinkedList;
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
