import { Readable } from 'stream';
import { parseBytes } from './parse-bytes';
import { throwHttpError } from './errors';
import { IncomingMessage } from 'http';

export interface BeachBodyOptions {
  /** Expected length in bytes of the content */
  length?: number;
  /** Maximum allowed size in bytes of the content */
  limit?: string | number;
  /**
   * Encoding to decode the stream buffer with
   * @default utf8
   */
  encoding?: BufferEncoding;
}

export default async function getBody(
  stream: Readable,
  { length, limit, encoding = 'utf8' }: BeachBodyOptions = {},
): Promise<string> {
  limit = parseBytes(limit);
  const buffer: Buffer[] = [];
  let received = 0;

  if (limit != null && length != null && length > limit) {
    throwHttpError(413, 'request entity too large', {
      expected: length,
      length,
      limit,
      type: 'entity.too.large',
    });
  }

  if (stream.readableEncoding) {
    throwHttpError(500, 'stream encoding should not be set', {
      type: 'stream.encoding.set',
    });
  }

  for await (const chunk of stream) {
    received += chunk.length;

    if (limit != null && received > limit) {
      throwHttpError(413, 'request entity too large', {
        limit,
        received,
        type: 'entity.too.large',
      });
    }

    buffer.push(chunk);
  }

  if ((stream as IncomingMessage).aborted) {
    throwHttpError(400, 'request aborted', {
      code: 'ECONNABORTED',
      expected: length,
      length,
      received,
      type: 'request.aborted',
    });
  }

  if (length != null && received !== length) {
    throwHttpError(400, 'request size did not match content length', {
      expected: length,
      length,
      received,
      type: 'request.size.invalid',
    });
  }

  return Buffer.concat(buffer, received).toString(encoding);
}

module.exports = getBody;
