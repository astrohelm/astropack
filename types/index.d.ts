type TDate = Date | String | Number;

export const time: {
  /**
   * Compare any Dates
   *  Create any dates compare functions or use our presets.
   * @example
   * const astropack = require('astro-kit');
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
  prettify: (format: string, date: Date | number | string) => string;
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
  diff: (a: Date, b: Date, measure?: 'h' | 'm' | 's' | 'i') => number;
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
