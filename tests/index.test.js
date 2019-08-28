import { useFixture } from './testUtils';

describe('babel-plugin-import-dir', () => {
  test('default import', async () => {
    const { output, expected } = await useFixture('default-import');
    expect(output).toEqual(expected);
  });

  test('default import with kebabcased directories', async () => {
    const { output, expected } = await useFixture('kebabcase-import');
    expect(output).toEqual(expected);
  });

  test('named import (single)', async () => {
    const { output, expected } = await useFixture('named-import-single');
    expect(output).toEqual(expected);
  });

  test('named import (multiple)', async () => {
    const { output, expected } = await useFixture('named-import-multiple');
    expect(output).toEqual(expected);
  });

  test('mixed imports', async () => {
    const { output, expected } = await useFixture('mixed-imports');
    expect(output).toEqual(expected);
  });
});
