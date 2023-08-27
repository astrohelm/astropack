'use strict';

const inRange = (x, min, max) => x >= min && x <= max;

const cases = {
  isConstant: s => s === s.toUpperCase(),
  isFirstUpper: s => !!s && inRange(s[0], 'A', 'Z'),
  isFirstLower: s => !!s && inRange(s[0], 'a', 'z'),
  isFirstLetter: s => cases.isFirstUpper(s) || cases.isFirstLower(s),
  toLowerCamel: s => s.charAt(0).toLowerCase() + s.slice(1),
  toUpperCamel: s => s.charAt(0).toUpperCase() + s.slice(1),
  toLower: s => s.toLowerCase(),
  toCamel: separator => s => {
    const words = s.split(separator);
    const first = words.length > 0 ? words.shift().toLowerCase() : '';
    return first + words.map(cases.toLower).map(cases.toUpperCamel).join('');
  },
  fromCamel: separator => s => {
    const first = s.match(/^[a-z][^A-Z]*/)[0];
    const words = s.match(/([A-Z][^A-Z]*)/g).map(cases.toLower);
    return first + separator + words.join(separator);
  },
};

cases.spinalToCamel = cases.toCamel('-');
cases.camelToSpinal = cases.fromCamel('-');
cases.camelToSnake = cases.fromCamel('_');
cases.snakeToCamel = cases.toCamel('_');

module.exports = cases;
