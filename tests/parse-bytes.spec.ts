import { parseBytes } from '../src/parse-bytes';

test('return number as is', () => {
  expect(parseBytes(1024)).toBe(1024);
});

test('NaN results in undefined', () => {
  expect(parseBytes(NaN)).toBeUndefined();
});

test('no arg results in undefined', () => {
  expect(parseBytes()).toBeUndefined();
});

test('default suffix', () => {
  expect(parseBytes('1024')).toBe(1024);
});

test('various suffixes', () => {
  expect(parseBytes('1b')).toBe(1);
  expect(parseBytes('1kb')).toBe(1024);
  expect(parseBytes('1mb')).toBe(1048576);
  expect(parseBytes('1gb')).toBe(1073741824);
});
