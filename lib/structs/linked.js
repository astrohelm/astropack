/* eslint-disable no-unmodified-loop-condition */
'use strict';

module.exports = function LinkedList(...values) {
  // prettier-ignore
  var head = null, tail = null, length = 0;
  const chaining = { before: null, after: null };
  this.chain = (name, list) => void (chaining[name] = list);
  this.unchain = name => void (chaining[name] = null);
  this.indexOf = value => selectByValue(value)[1];
  this.includes = value => selectByValue(value)[1] !== -1;
  this.update = (i, v) => (select(i).value = v);
  this.pop = () => this.delete(length - 1);
  this.shift = () => this.delete(0);
  this.toJSON = () => [...this];
  this.toString = () => [...this];
  this.at = i => select(i).value;
  this.unshift = add.bind(null, true);
  this.push = add.bind(null, false);
  this[Symbol.iterator] = function* () {
    const { before, after } = chaining;
    if (before) yield* before;
    var current = head;
    while (current) {
      yield current.value;
      current = current.next;
    }
    if (after) yield* after;
  };

  Object.defineProperty(this, 'length', {
    enumerable: true,
    get: () => length,
    set: v => {
      var k = length < v ? 'push' : 'shift';
      if (typeof v !== 'number') throw new Error('Linked List length must be a number');
      while (length - v) this[k](undefined);
    },
  });

  this.filter = callback => {
    // prettier-ignore
    var result = new LinkedList(), i = -1;
    for (var value of this) callback(value, ++i, this) ? result.push(value) : 0;
    return result;
  };

  this.forEach = callback => {
    let i = -1;
    for (var value of this) callback(value, ++i, this);
  };

  this.map = callback => {
    // prettier-ignore
    var result = new LinkedList(), i = -1;
    for (var value of this) result.push(callback(value, ++i, this));
    return result;
  };

  this.reduce = (callback, init) => {
    // prettier-ignore
    var result = init, i = -1;
    for (var value of this) result = callback(result, value, ++i, this);
    return result;
  };

  this.delete = index => {
    if (index < 0 || index >= length) throw new Error('Invalid index');
    if (index === 0 || index === length - 1) {
      var item = head;
      if (tail === head) tail = head = null;
      else if (index === 0) [head.next.prev, head] = [null, head.next];
      else [tail.prev.next, item, tail] = [null, tail, tail.prev];
      return length--, item.value;
    }

    const curr = select(index);
    if (curr.prev) curr.prev.next = curr.next;
    if (curr.next) curr.next.prev = curr.prev;
    return length--, curr.value;
  };

  this.deleteValue = value => {
    const [curr, i] = selectByValue(value);
    if (!curr) return i;
    if (i === 0) {
      head.next.prev = null;
      head = head.next;
    } else if (i === length - 1) {
      tail.prev.next = null;
      tail.prev.next = tail.prev;
    } else {
      if (curr.prev) curr.prev.next = curr.next;
      if (curr.next) curr.next.prev = curr.prev;
    }
    return length--, i;
  };

  if (values.length) this.push(...values);
  return new Proxy(this, {
    get: (target, prop, reciever) => {
      if (prop === Symbol.iterator) return target[Symbol.iterator].bind(target);
      var index = parseInt(prop);
      if (isNaN(index)) return Reflect.get(target, prop, reciever);
      return select(prop)?.value;
    },
    set: (target, prop, value, reciever) => {
      var index = parseInt(prop);
      if (isNaN(index)) return Reflect.set(target, prop, value, reciever);
      while (index < 0) index = length + index;
      if (index > length - 1) target.length = index;
      select(index).value = value;
      return true;
    },
  });

  function selectByValue(value) {
    for (var i = 0, curr = head; i < length; ++i, curr = curr.next) {
      if (curr.value === value) return [curr, i];
    }
    return [null, -1];
  }

  function select(index) {
    while (index < 0) index = length + index;
    if (index >= length) return null;
    if (index === length - 1) return tail;
    if (index === 0) return head;
    const strategy = length / 2 > index;
    var [curr, key, steps] = strategy ? [head, 'next', index] : [tail, 'prev', length - index - 1];
    for (var i = 0; i < steps; i += 1) curr = curr[key];
    return curr;
  }

  function add(flag, ...elements) {
    if (!elements.length) return length;
    if (head === null) {
      tail = head = new Node(elements[0]);
      elements.length > 1 && add(flag, ...elements.slice(1));
      return ++length;
    }
    length += elements.length;
    elements.forEach(v => {
      const node = new Node(v);
      if (flag) {
        node.next = head;
        head = head.prev = node;
        return;
      }
      node.prev = tail;
      tail = tail.next = node;
    });
    return length;
  }
};

function Node(value) {
  this.value = value;
  this.next = null;
  this.prev = null;
}
