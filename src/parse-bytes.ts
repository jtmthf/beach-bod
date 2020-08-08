// Derived from `https://github.com/visionmedia/bytes.js`

const map = {
  b: 1,
  kb: 1024,
  mb: 1024 ** 2,
  gb: 1024 ** 3,
  tb: 1024 ** 4,
  pb: 1024 ** 5,
};

const parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(b|kb|mb|gb|tb|pb)$/i;

export function parseBytes(val?: number | string): number | undefined {
  if (typeof val === 'number' && !isNaN(val)) {
    return val;
  }

  if (typeof val !== 'string') {
    return undefined;
  }

  // Test if the string passed is valid
  const results = parseRegExp.exec(val);

  return Math.floor(
    map[(results?.[4].toLowerCase() ?? 'b') as keyof typeof map] *
      Number(results?.[1] ?? val),
  );
}
