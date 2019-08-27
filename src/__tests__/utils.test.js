/*
 * Created by liwei.ong on 2019-08-26.
 */
const utils = require('../utils');
const path = require('path');

describe('utils.getModulesFromPattern', () => {
  test('basic wildcard *', () => {
    const targetDir = path.join(__dirname, './fixtures/test-dir');
    expect(utils.getModulesFromPattern(path.join(targetDir, '*'))).toEqual(
      ['a', 'b', 'c'].map(submodule => path.join(targetDir, submodule))
    );
  });
});
