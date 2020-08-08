# beach-body

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]
![Build](https://github.com/jtmthf/beach-body/workflows/CI/badge.svg)

zero-dependency util to read and validate the body of a readable stream

## Install

### Yarn

```sh
yarn add beach-body
```

### NPM

```sh
npm install beach-body
```

## API

```ts
import getBody from 'beach-body';
```

### `getBody(stream: Readable, options?: BeachBodyOptions): Promise<string>`

### `BeachBodyOptions`

| property   | type                          | default     | description                                  |
| ---------- | ----------------------------- | ----------- | -------------------------------------------- |
| `length`   | `number | undefined`          | `undefined` | Expected length in bytes of the content      |
| `limit`    | `number | string | undefined` | `undefined` | Maximum allowed size in bytes of the content |
| `encoding` | `BufferEncoding | undefined`  | `utf8`      | Encoding to decode the stream buffer with    |

## Errors

### Types

The errors from this module have a `type` property which allows for the programmatic determination of the type of error returned.

#### entity.too.large

This error will occur when the `limit` option is specified, but the stream has an entity that is larger.

#### request.aborted

This error will occur when the request stream is aborted by the client before
reading the body has finished.

#### request.size.invalid

This error will occur when the `length` option is specified, but the stream has emitted more bytes.

#### stream.encoding.set

This error will occur when the given stream has an encoding set on it, making it a decoded stream. The stream should not have an encoding set
and is expected to emit `Buffer` objects.

## Examples

### Simple Node example

```js
const http = require('http');
const getBody = require('beach-body');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
  const body = await getBody(req, {
    length: req.headers['content-length'],
    limit: '1mb',
  });

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end(body);
});
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/beach-body.svg
[npm-url]: https://npmjs.org/package/beach-body
[downloads-image]: https://img.shields.io/npm/dm/beach-body.svg
[downloads-url]: https://npmjs.org/package/beach-body
