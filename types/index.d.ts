type TDate = Date | String | Number;

export const time: {
  compare: (fn: (a: number, b: number) => boolean) => (a: TDate, b: TDate) => boolean;
  compare: {
    bigger: (a: TDate, b: TDate) => boolean;
    under: (a: TDate, b: TDate) => boolean;
    equal: (a: TDate, b: TDate) => boolean;
  };
  prettify: (format: string, date: Date | number | string) => string;
  format: (ms: number) => string;
  measures: (ms: number) => {
    w: number;
    d: number;
    h: number;
    m: number;
    s: number;
    i: number;
  };
  diff: (a: Date, b: Date, measure?: 'h' | 'm' | 's' | 'i') => number;
  duration: (time: string) => number;
};
