const plugin = require('../index');
const path = require('path');
const fs = require('fs');
const { transformFileAsync } = require('@babel/core');
const prettier = require('prettier');
const prettierOptions = require('../../prettier.config.js');

// jest.mock('../utils', () => {
//   const actualUtils = jest.requireActual('../utils');
//   return {
//     ...actualUtils,
//     getDirs() {
//       return ['./a', './b'];
//     },
//   };
// });

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
  it('default import', async () => {
    const { output, expected } = await useFixture('default-import');
    expect(output).toEqual(expected);
  });

  it('named import (single)', async () => {
    const { output, expected } = await useFixture('named-import-single');
    expect(output).toEqual(expected);
  });

  it('named import (multiple)', async () => {
    const { output, expected } = await useFixture('named-import-multiple');
    expect(output).toEqual(expected);
  });

  it('mixed imports', async () => {
    const { output, expected } = await useFixture('mixed-imports');
    expect(output).toEqual(expected);
  });
});
