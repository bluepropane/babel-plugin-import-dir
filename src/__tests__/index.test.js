const plugin = require('../index');
const path = require('path');
const fs = require('fs');
const { transformFileAsync } = require('@babel/core');

jest.mock('../utils', () => {
  const { modulePathToName } = jest.requireActual('../utils');
  return {
    getDirs() {
      return ['a', 'b'];
    },
    modulePathToName
  };
});

async function useFixture(fixtureName) {
  const fixturePath = path.join(__dirname, `/fixtures/${fixtureName}`);
  const expected = await new Promise(res =>
    fs.readFile(path.join(fixturePath, 'output.js'), (err, data) =>
      res(data.toString())
    )
  );

  return {
    output: await transformFileAsync(path.join(fixturePath, 'code.js'), {
      plugins: [plugin]
    }).then(res => res.code),
    expected
  };
}

describe('babel-plugin-import-dir', () => {
  it('default import', async () => {
    const { output, expected } = await useFixture('default-import');
    console.log(output, expected);
    expect(output).toEqual(expected);
  });

  it('aliased import', () => {});
});
