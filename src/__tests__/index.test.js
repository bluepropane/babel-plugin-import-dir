const plugin = require('../index');
const path = require('path');
const fs = require('fs');
const { transformFileAsync } = require('@babel/core');
const prettier = require('prettier');
const prettierOptions = require('../../prettier.config.js');
const utils = require('../utils');

const mockGetDir = jest.spyOn(utils, 'getModulesFromPattern');

async function useFixture(fixtureName) {
  const fixturePath = path.join(__dirname, `/fixtures/${fixtureName}`);
  const expected = await new Promise(res =>
    fs.readFile(path.join(fixturePath, 'output.js'), (err, data) =>
      res(data.toString())
    )
  );

  return {
    output: await transformFileAsync(path.join(fixturePath, 'code.js'), {
      plugins: [plugin],
    }).then(res => prettier.format(res.code, prettierOptions)),
    expected,
  };
}

describe('babel-plugin-import-dir', () => {
  beforeEach(() => {
    // reset default behaviour for getDir
    mockGetDir.mockImplementation(() => {
      return ['./a', './b'];
    });
  });

  test('default import', async () => {
    const { output, expected } = await useFixture('default-import');
    expect(output).toEqual(expected);
  });

  test('default import with kebabcased directories', async () => {
    mockGetDir.mockImplementation(() => {
      return ['./a-a', './b'];
    });
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
