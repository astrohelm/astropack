'use strict';

module.exports = Pool;

const DEFAULT_FACTORY = () => null;
function Pool(factory = DEFAULT_FACTORY) {
  const storage = [];
  this.put = value => void storage.push(value);
  this.pop = () => (storage.length ? storage.pop() : factory());
}
