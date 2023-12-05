'use strict';

const Semaphore = function (concurrency, size = 0, timeout = 0) {
  if (!new.target) return new Semaphore(concurrency, size, timeout);
  [this.queue, this.counter, this.empty] = [[], concurrency, true];

  // prettier-ignore
  this.enter = () => new Promise((resolve, reject) => {
    if (this.counter > 0) {
      this.counter--;
      this.empty = false;
      return void resolve();
    }

    if (this.queue.length >= size) return void reject(new Error('Semaphore queue is full'));
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

  this.leave = () => {
    if (this.queue.length === 0) {
      this.counter++;
      this.empty = this.counter === concurrency;
      return;
    }

    const { resolve, timer } = this.queue.shift();
    clearTimeout(timer);
    resolve && setTimeout(resolve, 0);
    this.empty = this.queue.length === 0 && this.counter === concurrency;
  };

  return this;
};

module.exports = Semaphore;
