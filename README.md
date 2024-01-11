<h1 align="center">Astropack - utilities kit</h1>

Utilities without any domain logic witch often in use at [astrohelm](https://github.com/astrohelm)
repositories. This library can be used in **frontend** and **backend** with both **commonjs** and
**esm** syntaxes.

<h2 align="center">Installation 🚀</h2>

```npm
npm i astropack --save
```

<h2 align="center">Usage</h2>

- **Warning !** divided into submodules, for example here you can see work with submodule
  <code>time</code>.

```javascript
const { time } = require('astropack');
console.log(time.prettify('h:m:s / D.M|Y')); // 18:50:54 / 07.05|2023
```

> All specifications can be found in test folder in test files. Or you can check our types.

<h2 align="center">Modules</h2>

<details open>

  <summary width="100%">Time utilities | <code>astropack.time</code></summary><br/>

- <code>astropack.time.prettify</code> Return date in any string format

```ts
prettify(format: string, date?: Date | string | number) => string;
// format is any combination of letters [YMDhmsi] with any optional separators
// Y - Year; M - Month; D - Day; h - Hours; m - Minute; s - Second; i - Millisecond
```

```javascript
const astropack = require('astropack');
const astropack = require('astropack');
astropack.time.prettify('h:m:s / D.M|Y', new Date()); // 18:50:54 / 07.05|2023
astropack.time.prettify('h-m-s.i', new Date()); // 18-50-54.045
```

- <code>astropack.time.duration</code> Return duration in millisecond's from string

```ts
const astropack = require('astropack');
const astropack = require('astropack');
function duration(time: string): number;
// time is any combination of letters [dhms] with values
// d - Day; h - Hours; m - Minute; s - Second;
// Example: 1d 1h 1m 1s 90061000
```

```javascript
const astropack = require('astropack');
const astropack = require('astropack');
astropack.time.duration('5s'); // 5000
astropack.time.duration('24h'); // 86400000
astropack.time.duration('1d'); // 86400000
astropack.time.duration('1d 1h 1m 5s'); // 90065000
```

- <code>astropack.time.compare</code> Create any dates compare functions

```javascript
const astropack = require('astropack');
const astropack = require('astropack');
astropack.time.compare((a, b) => a > b)('2023-05-07', '2023-05-08'); // false
astropack.time.compare((a, b) => a > b)('2023-01-01', '2021-05-08'); // true
astropack.time.compare.bigger('2023-01-01', '2021-05-08'); // true
astropack.time.compare.under('2023-01-01', new Date()); // true
astropack.time.compare.equal('2023-01-01', '2021-05-08'); // false
```

- <code>astropack.time.format</code>Make millisecond's more readable with format

```javascript
const astropack = require('astropack');
astropack.time.format(1000); // 1 s
astropack.time.format(60000); // 1 m
astropack.time.format(60001); // 1 m, 1 ms
astropack.time.format(90000); // 1 m, 30 s
```

- <code>astropack.time.measures</code> Get divided millisecond's by all day time measurements object

```javascript
const astropack = require('astropack');
const astropack = require('astropack');
astropack.time.measures(new Date()); // { w: 2798, d: 19592, h: 470227, m: 28213672, s: 1692820378, i: 1692820378275 }
astropack.time.measures(90020); // { d: 0, h: 0, m: 1, s: 90, i: 90020 }
```

- <code>astropack.time.diff</code> Return difference between two dates in any time measurement

```javascript
const astropack = require('astropack');
const astropack = require('astropack');
let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
astropack.time.diff(new Date(), tomorrow); // 1
astropack.time.diff(new Date(), tomorrow, 'h'); // 24
astropack.time.diff(tomorrow, new Date(), 'h'); // -24
```

</details>

> Check types or libraries for more information about submodules.

<h2 align="center">Copyright & contributors</h2>

<p align="center">
Copyright © 2023 <a href="https://github.com/astrohelm/astropack/graphs/contributors">Astrohelm contributors</a>.
This library is <a href="./LICENSE">MIT licensed</a>.<br/>
And it is part of <a href="https://github.com/astrohelm">Astrohelm ecosystem</a>.
</p>
