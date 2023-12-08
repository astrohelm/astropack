type TDate = Date | String | Number;
type TMap = { [k: string]: unknown };

export const structs = {
  Semaphore: class Semaphore {
    static symbols: { kConcurrncy: symbol; kTimeout: symbol; kSize: symbol };
    empty: boolean;
    count: number;
    leave: () => Promise<void>;
    enter: () => Promise<void>;
    constructor(concurency: number, size?: number, timeout?: number);
  },

  LinkedList: class LinkedList<T = unknown> {
    constructor(...values: T[]);
    chain: (type: 'before' | 'after', list: LinkedList) => void;
    unchain: (type: 'before' | 'after') => void;
    indexOf: (v: T) => number;
    includes: (v: T) => boolean;
    with: (i: number, v: T) => T;
    at: (i: number) => T;
    shift: () => T;
    pop: () => T;
    unshift: (...args: T[]) => number;
    push: (...args: T[]) => number;
    delete: (i: number) => T;
    deleteValue: (v: T) => T;
    fill: <T>(v: T) => LinkedList<T>;
    every: (callback: (value: T, i: number, target: LinkedList) => boolean) => boolean;
    find: (callback: (value: T, i: number, target: LinkedList) => boolean) => T;
    some: (callback: (value: T, i: number, target: LinkedList) => boolean) => boolean;
    forEach: (callback: (value: T, i: number, target: LinkedList) => void) => void;
    map: (callback: (value: T, i: number, target: LinkedList) => unknown) => LinkedList;
    reduce: <A>(callback: (value: T, i: number, target: LinkedList) => unknown, acc: A) => unknown;
    filter: (callback: (value: T, i: number, target: LinkedList) => boolean) => LinkedList;
    length: number;
    static symbols: {
      kHead: symbol;
      kTail: symbol;
      kLength: symbol;
      kSelect: symbol;
      kValueSelect: symbol;
      kAdd: symbol;
      kChain: symbol;
    };
  },

  Pool: class Pool<T = unknown> {
    static symbols: { kFactory: symbol; kStorage: symbol };
    constructor(factory: () => T);
    pop: () => T;
    put: (v: T) => void;
  },
};

export const time: {
  /**
   * Compare any Dates
   *  Create any dates compare functions or use our presets.
   * @example
   * const astropack = require('astropack');
   * astropack.time.compare((a, b) => a > b)('2023-05-07', '2023-05-08'); // false
   * astropack.time.compare((a, b) => a > b)('2023-01-01', '2021-05-08'); // true
   * astropack.time.compare.bigger('2023-01-01', '2021-05-08'); // true
   * astropack.time.compare.under('2023-01-01', new Date()); // true
   * astropack.time.compare.equal('2023-01-01', '2021-05-08'); // false
   */
  compare: {
    (fn: (a: number, b: number) => boolean): (a: TDate, b: TDate) => boolean;
    bigger: (a: TDate, b: TDate) => boolean;
    under: (a: TDate, b: TDate) => boolean;
    equal: (a: TDate, b: TDate) => boolean;
  };
  /**
   * Dates formatter
   * Format is any combination of letters [YMDhmsi] with any optional separators;
   * @example <caption>Y - Year; M - Month; D - Day; h - Hours; m - Minute; s - Second; i - Millisecond</caption>
   * const astropack = require('astropack');
   * astropack.time.prettify('h:m:s / D.M|Y', new Date()); // 18:50:54 / 07.05|2023
   * astropack.time.prettify('h-m-s.i', new Date()); // 18-50-54.045
   */
  prettify: (format?: string, date?: Date | number | string) => string;
  /**
   * Time formatter
   * Make millisecond's more readable with format;
   * @example
   * const astropack = require('astropack');
   * astropack.time.format(1000); // 1 s
   * astropack.time.format(60000); // 1 m
   * astropack.time.format(60001); // 1 m, 1 ms
   * astropack.time.format(90000); // 1 m, 30 s
   */
  format: (ms: number) => string;
  /**
   * Time measurements
   * Get divided millisecond's by all day time measurements;
   * @example
   * const astropack = require('astropack');
   * astropack.time.measures(new Date()); // { w: 2798, d: 19592, h: 470227, m: 28213672, s: 1692820378, i: 1692820378275 }
   * astropack.time.measures(90020); // { d: 0, h: 0, m: 1, s: 90, i: 90020 }
   */
  measures: (ms: number) => {
    w: number;
    d: number;
    h: number;
    m: number;
    s: number;
    i: number;
  };
  /**
   * Dates difference
   * Return difference between two dates in any time measurement;
   * @example
   * const astropack = require('astropack');
   * let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
   * astropack.time.diff(new Date(), tomorrow); // 1
   * astropack.time.diff(new Date(), tomorrow, 'h'); // 24
   * astropack.time.diff(tomorrow, new Date(), 'h'); // -24
   */
  diff: (a: Date, b: Date, measure?: 'yaer' | 'month' | 'd' | 'h' | 'm' | 's' | 'i') => number;
  /**
   * Duration shorthands
   * use shorthands, such as 2h 30m to get milliseconds
   * @example <caption>d - Day; h - Hours; m - Minute; s - Second</caption>
   * const astropack = require('astropack');
   * astropack.time.duration('5s'); // 5000
   * astropack.time.duration('24h'); // 86400000
   * astropack.time.duration('1d'); // 86400000
   * astropack.time.duration('1d 1h 1m 5s'); // 90065000
   */
  duration: (time: string) => number;
};

export const fs: {
  file: {
    /**
     * Ensure that dir exists
     *  Will create a directory if it doesn't exist
     * @example
     * const astropack = require('astropack');
     * astropack.fs.file.name('/path/to/file.ext'); // file
     */
    name: (name: string) => string;
    /**
     * Ensure that dir exists
     *  Will create a directory if it doesn't exist
     * @example
     * const astropack = require('astropack');
     * astropack.fs.file.ext('/path/to/file.ext'); // ext
     */
    ext: (name: string) => string;
    /**
     * Ensure that dir exists
     *  Will create a directory if it doesn't exist
     * @example
     * const astropack = require('astropack');
     * astropack.fs.file.dir('/path/to/file.ext'); // /path/to
     */
    dir: (name: string) => string;
  };
  dir: {
    /**
     * Ensure that dir exists
     *  Will create a directory if it doesn't exist
     * @example
     * const astropack = require('astropack');
     * astropack.fs.dir.ensure('/path/to/dir').then(status => console.log(status));
     */
    ensure: (path: string) => Promise<boolean>;
    /**
     * Ensure that dir exists
     * @example
     * const astropack = require('astropack');
     * astropack.fs.dir.check('/path/to/dir').then(status => console.log(status));
     */
    check: (path: string) => Promise<boolean>;
  };
};

export const utils: {
  /**
   * Equality check
   * @example
   * const astropack = require('astropack');
   * astropack.utils.equals(1, 1); // true
   * astropack.utils.equals('test', 'test'); // true
   * astropack.utils.equals({ a: 1 }, { a: 1 }); // true
   * astropack.utils.equals([1, 2, [3]], [1, 2, [3]]); // true
   * astropack.utils.equals({ a: { b: 'c' } }, { a: { b: 'c' } }); // true
   */
  equals: <T>(a: T, b: T) => boolean;
  /**
   * Bytes prettiftcation
   * Can contain up to YB
   * @example
   * const astropack = require('astropack');
   * astropack.utils.prettyBytes(1100); // '1.1 KB'
   */
  prettyBytes: (bytes: number) => string;
  /**
   * @returns Type of function
   * @example
   * const astropack = require('astropack');
   * astropack.utils.isFunction(() => {}); // 'arrow'
   * astropack.utils.isFunction(function Test() {}); // 'function'
   * astropack.utils.isFunction(class Test {}); // 'class'
   * astropack.utils.isFunction(async function Test {}); // 'async'
   * astropack.utils.isFunction(async test () => {}); // 'async'
   * astropack.utils.isFunction(1); // null
   */
  isFunction: (sample: (...args) => unknown) => null | 'arrow' | 'async' | 'function' | 'class';
  /**
   * @returns Safe your sync function
   * @example
   * const astropack = require('astropack');
   * const parse = astropack.utils.safe(JSON.parse());
   * const [err, result] = parse('{'); // [Error, null]
   * const [err, result] = parse('{}'); // [null, {}]
   */
  safe(fn: <T = unknown>(...args) => T);
};

export const string: {
  /**
   * Parse value from string
   * @example
   * const astropack = require('astropack');
   * astropack.string.from('false'); // false
   * astropack.string.from('undefined'); // undefined
   * astropack.string.from('null'); // null
   * astropack.string.from('12.23'); // 12.23
   * astropack.string.from('test'); // 'test'
   * astropack.string.from('{"test":true}'); // { test: true }
   */
  from: (value: string) => unknown;
  /**
   * Parse value to string
   * @example
   * const astropack = require('astropack');
   * astropack.string.to(false); // 'false'
   * astropack.string.to(undefined); // 'undefined'
   * astropack.string.to('12.23'); // '12.23'
   * astropack.string.to('test'); // 'test'
   * astropack.string.to({ test: true }); // '{"test":true}'
   */
  to: (value: unknown) => string;
  /**
   * Safe json parser, returns null if error
   * @example
   * const astropack = require('astropack');
   * astropack.string.jsonParse('{'); // null
   * astropack.string.jsonParse('{"test":true}'); // { "test": true }
   */
  jsonParse: (value: unknown) => object | null;
  /**
   * String template creator
   * @example
   * const astropack = require('astropack');
   * const temp = astropack.string.template`Hello ${'user'} !`;
   * temp({ user: 'astro' }); // 'Hello astro !';
   */
  template: (s: string[], ...keys: string[]) => (values: TMap) => string;
  case: {
    /**
     * @example
     * const astropack = require('astropack');
     * const temp = astropack.string.case.isConstant('GLOBAL'); // true
     */
    isConstant: (s: string) => boolean;
    /**
     * @example
     * const astropack = require('astropack');
     * const temp = astropack.string.case.isFirstUpper('Hello'); // true
     */
    isFirstUpper: (s: string) => boolean;
    /**
     * @example
     * const astropack = require('astropack');
     * let temp = astropack.string.case.isFirstLetter('H1'); // true
     * temp = astropack.string.case.isFirstLetter('1H'); // false
     */
    isFirstLetter: (s: string) => boolean;
    /**
     * @example
     * const astropack = require('astropack');
     * let temp = astropack.string.case.isFirstLower('hello'); // true
     */
    isFirstLower: (s: string) => boolean;
    /**
     * @example
     * const astropack = require('astropack');
     * let temp = astropack.string.case.toCamel('-')('hello-world'); // helloWorld
     * let temp = astropack.string.case.toCamel(' ')('hello world'); // helloWorld
     */
    toCamel: (sep: string) => (s: string) => string;
    /**
     * @example
     * const astropack = require('astropack');
     * let temp = astropack.string.case.fromCamel('-')('helloWorld'); // hello-world
     * let temp = astropack.string.case.fromCamel(' ')('helloWorld'); // hello world
     */
    fromCamel: (sep: string) => (s: string) => string;
    /**
     * @example
     * const astropack = require('astropack');
     * let temp = astropack.string.case.spinalToCamel('hello-world'); // helloWorld
     */
    spinalToCamel: (s: string) => string;
    /**
     * @example
     * const astropack = require('astropack');
     * let temp = astropack.string.case.camelToSpinal('helloWorld'); // hello-world
     */
    camelToSpinal: (s: string) => string;
    /**
     * @example
     * const astropack = require('astropack');
     * let temp = astropack.string.case.camelToSnake('helloWorld'); // hello_world
     */
    camelToSnake: (s: string) => string;
    /**
     * @example
     * const astropack = require('astropack');
     * let temp = astropack.string.case.snakeToCamel('hello_world'); // helloWorld
     */
    snakeToCamel: (s: string) => string;
  };
};

export const object: {
  /**
   * @example
   * const astropack = require('astropack');
   * const sample = { get: () => {}, set: () => {}, test: 123 };
   * let temp = astropack.object.methods(sample); // ['get','set']
   */
  methods: Array<string>;
  /**
   * @example
   * const astropack = require('astropack');
   * const sample = { get: () => {}, set: () => {}, test: 123 };
   * let temp = astropack.object.properties(sample); // ['test']
   */
  properties: Array<string>;
  /**
   * @example
   * const astropack = require('astropack');
   * const sample = { get: () => {}, set: () => {}, test: 123 };
   * let temp = astropack.object.entries(sample);
   * // [['get', Function], ['set', Function], ['test', 123]]
   */
  entries: Array<[string, unknown]>;
};
