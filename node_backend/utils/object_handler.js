import util from 'util';

import { toCamelCase, toSnakeCase } from './string_handler.js';

export function isEmptyObjectValues(obj, strict = false) {
  if (!obj || typeof obj !== 'object') return strict;

  return Object.values(obj).every((value) => value === '' || value === null || value === 0);
}

export function transformKeysToSnakeCase(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[toSnakeCase(key)] = obj[key];
    return acc;
  }, {});
}

export function transformKeysToCamelCase(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    acc[toCamelCase(key)] = obj[key];
    return acc;
  }, {});
}

export function cleanupObject(obj) {
  if (!obj || typeof obj !== 'object') return {};

  return Object.keys(obj).reduce((acc, key) => {
    let value = obj[key];

    if (typeof value === 'object' && value !== null) {
      value = cleanupObject(value);
    }

    const isValid =
      value !== null && value !== undefined && value !== 0 && (typeof value !== 'string' || value.trim() !== '') && (typeof value !== 'object' || Object.keys(value).length > 0);

    if (isValid) acc[key] = value;

    return acc;
  }, {});
}

export function invertMap(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [v, k]));
}

export function printObject(...args) {
  console.debug(...args.map((arg) => (typeof arg === 'object' && arg !== null ? util.inspect(arg, { depth: null, colors: true }) : arg)));
}
