import { Readable } from 'stream';
import getBody from '../src';
import { IncomingMessage } from 'http';

test('default options', async () => {
  const body = await getBody(Readable.from(generate(), { objectMode: false }));

  expect(body).toBe('this is a test stream');
});

test('length too large', async () => {
  await expect(
    getBody(Readable.from([]), {
      limit: 10,
      length: 11,
    }),
  ).rejects.toThrow('request entity too large');
});

test('encoding should not be set', async () => {
  await expect(
    getBody(Readable.from([], { encoding: 'utf-8' })),
  ).rejects.toThrow('stream encoding should not be set');
});

test('received exceeds limit', async () => {
  await expect(
    getBody(Readable.from(generate(), { objectMode: false }), { limit: '10b' }),
  ).rejects.toThrow('request entity too large');
});

test('aborted', async () => {
  const stream = Readable.from(generate(), { objectMode: false });
  (stream as IncomingMessage).aborted = true;

  await expect(getBody(stream)).rejects.toThrow('request aborted');
});

test('size does not match length', async () => {
  await expect(
    getBody(Readable.from(generate(), { objectMode: false }), { length: 10 }),
  ).rejects.toThrow('request size did not match content length');
});

async function* generate() {
  yield 'this ';
  yield 'is ';
  yield 'a ';
  yield 'test ';
  yield 'stream';
}
