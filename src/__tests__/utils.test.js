/*
 * Created by liwei.ong on 2019-08-26.
 */
const utils = require('../utils');
const path = require('path');

describe('utils.getModulesFromPattern', () => {
  test('basic wildcard *', async () => {
    const targetDir = path.join(__dirname, './fixtures/test-dir');
    await expect(
      utils.getModulesFromPattern(path.join(targetDir, '*'))
    ).resolves.toEqual(
      ['a', 'b', 'c'].map(submodule => path.join(targetDir, submodule))
    );
  });
});
