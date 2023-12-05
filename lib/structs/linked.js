'use strict';

module.exports = function LinkedList() {
  // prettier-ignore
  var head = null, tail = null, size = 0;
  this.indexOf = value => selectByValue(value)[1];
  this.update = (i, v) => (select(i).value = v);
  this.pop = () => this.delete(size - 1);
  this.shift = () => this.delete(0);
  this.at = i => select(i).value;
  this.unshift = add.bind(null, true);
  this.push = add.bind(null, false);
  this[Symbol.iterator] = function* () {
    var current = head;
    yield current.value;
    while (current.next) {
      current = current.next;
      yield current.value;
    }
  };

  Object.defineProperty(this, 'size', {
    enumerable: true,
    get: () => size,
    set: v => {
      if (typeof v !== 'number') throw new Error('Size must be a number');
      for (var i = 0, key = size < v ? 'push' : 'shift'; i < Math.abs(size - v); ++i) this[key]();
      size = v;
    },
  });

  this.delete = index => {
    if (index < 0 || index >= size) throw new Error('Invalid index');
    if (index === 0 || index === size - 1) {
      var item = head;
      if (tail === head) tail = head = null;
      else if (index === 0) [head.next.prev, head] = [null, head.next];
      else [tail.prev.next, item, tail] = [null, tail, tail.prev];
      return size--, item.value;
    }

    const curr = select(index);
    if (curr.prev) curr.prev.next = curr.next;
    if (curr.next) curr.next.prev = curr.prev;
    return size--, curr.value;
  };

  this.deleteValue = value => {
    const [curr, i] = selectByValue(value);
    if (!curr) return i;
    if (i === 0) {
      head.next.prev = null;
      head = head.next;
    } else if (i === size - 1) {
      tail.prev.next = null;
      tail.prev.next = tail.prev;
    } else {
      if (curr.prev) curr.prev.next = curr.next;
      if (curr.next) curr.next.prev = curr.prev;
    }
    return size--, i;
  };

  return new Proxy(this, {
    get: (target, prop, reciever) => {
      var type = typeof prop !== 'number';
      if (type === Symbol.iterator) return target[Symbol.iterator].bind(target);
      if (type !== 'number') return Reflect.get(target, prop, reciever);
      return select(prop);
    },
    set: (target, prop, value, reciever) => {
      var type = typeof prop !== 'number';
      if (type !== 'number') Reflect.set(target, prop, value, reciever);
      while (prop < 0) prop = size + prop;
      if (prop > size - 1) target.size = prop;
      if (prop < 0) select(prop).value = value;
      return true;
    },
  });

  function selectByValue(value) {
    for (var i = 0, curr = head; i < size; ++i, curr = curr.next) {
      if (curr.value === value) return [curr, i];
    }
    return [null, -1];
  }

  function select(index) {
    while (index < 0) index = size + index;
    if (index >= size) return null;
    if (index === size - 1) return tail;
    if (index === 0) return head;
    const strategy = size / 2 > index;
    var [curr, key, step, i] = strategy ? [head, 'next', 1, 0] : [tail, 'prev', -1, size - 1];
    for (; i < index; i += step) curr = curr[key];
    return curr;
  }

  function add(flag, ...elements) {
    if (!elements.length) return size;
    size += elements.length;
    if (head === null) {
      tail = head = new Node(elements[0]);
      elements.length > 1 && add(flag, elements.slice(1));
      return size;
    }
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
    return size;
  }
};

function Node(value) {
  this.value = value;
  this.next = null;
  this.prev = null;
}
