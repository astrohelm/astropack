<h1 align="center">Astrokit - utilities kit</h1>

<h2 align="center">Installation 🚀</h2>

```npm
npm i leadastrokit --save
```

<h2 align="center">Usage</h2>

- **Warning !** divided into submodules, for example here you can see work with submodule
  <code>time</code>.

```javascript
const { time } = require('astrokit');
console.log(time.prettify('h:m:s / D.M|Y')); // 18:50:54 / 07.05|2023
```

> All specifications can be found in test folder in test files. Or you can check our types.

<h2 align="center">Modules</h2>

<details open>

  <summary width="100%">Time utilities | <code>astrokit.time</code></summary><br/>

- <code>astrokit.time.prettify</code> Return date in any string format

```ts
prettify(format: string, date?: Date | string | number) => string;
// format is any combination of letters [YMDhmsi] with any optional separators
// Y - Year; M - Month; D - Day; h - Hours; m - Minute; s - Second; i - Millisecond
```

```javascript
const astrokit = require('astro-kit');
astrokit.time.prettify('h:m:s / D.M|Y', new Date()); // 18:50:54 / 07.05|2023
astrokit.time.prettify('h-m-s.i', new Date()); // 18-50-54.045
```

- <code>astrokit.time.duration</code> Return duration in millisecond's from string

```ts
const astrokit = require('astro-kit');
function duration(time: string): number;
// time is any combination of letters [dhms] with values
// d - Day; h - Hours; m - Minute; s - Second;
// Example: 1d 1h 1m 1s 90061000
```

```javascript
const astrokit = require('astro-kit');
astrokit.time.duration('5s'); // 5000
astrokit.time.duration('24h'); // 86400000
astrokit.time.duration('1d'); // 86400000
astrokit.time.duration('1d 1h 1m 5s'); // 90065000
```

- <code>astrokit.time.compare</code> Create any dates compare functions

```javascript
const astrokit = require('astro-kit');
astrokit.time.compare((a, b) => a > b)('2023-05-07', '2023-05-08'); // false
astrokit.time.compare((a, b) => a > b)('2023-01-01', '2021-05-08'); // true
astrokit.time.compare.bigger('2023-01-01', '2021-05-08'); // true
astrokit.time.compare.under('2023-01-01', new Date()); // true
astrokit.time.compare.equal('2023-01-01', '2021-05-08'); // false
```

- <code>astrokit.time.format</code>Make millisecond's in more readable format

```javascript
const astrokit = require('astro-kit');
astrokit.time.formatDuration(1000); // 1 s
astrokit.time.formatDuration(60000); // 1 m
astrokit.time.formatDuration(60001); // 1 m, 1 ms
astrokit.time.formatDuration(90000); // 1 m, 30 s
```

- <code>astrokit.time.measures</code> Get a divided millisecond's by all day time measurements
  object

```javascript
const astrokit = require('astro-kit');
astrokit.time.measures(new Date()); // { w: 2798, d: 19592, h: 470227, m: 28213672, s: 1692820378, i: 1692820378275 }
astrokit.time.measures(90020); // { d: 0, h: 0, m: 1, s: 90, i: 90020 }
```

- <code>astrokit.time.diff</code> Return difference between two dates in any time measurement

```javascript
const astrokit = require('astro-kit');
let tomorrow = new Date(new Date().setDate(new Date().getDate() + 1));
astrokit.time.diff(new Date(), tomorrow); // 1
astrokit.time.diff(new Date(), tomorrow, 'h'); // 24
astrokit.time.diff(tomorrow, new Date(), 'h'); // -24
```

</details>

<h2 align="center">Copyright & contributors</h2>

<p align="center">
Copyright © 2023 <a href="https://github.com/astrohelm/astrokit/graphs/contributors">Astrohelm contributors</a>.
Workspace is <a href="./LICENSE">MIT licensed</a>.<br/>
Workspace is part of <a href="https://github.com/astrohelm">Astrohelm ecosystem</a>.
</p>
