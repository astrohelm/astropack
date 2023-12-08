'use strict';

const kFactory = Symbol('factory');
const kStorage = Symbol('storage');
const DEFAULT_FACTORY = () => null;
module.exports = Pool;
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
