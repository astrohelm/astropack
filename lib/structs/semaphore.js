'use strict';

const kConcurrncy = Symbol('concurrncy');
const kTimeout = Symbol('timeout');
const kSize = Symbol('size');
module.exports = Semaphore;

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
