/*
 * Created by liwei.ong on 2019-08-28.
 */
import plugin from '..';
import prettier from 'prettier';
import { transformFileAsync } from '@babel/core';
const path = require('path');
const fs = require('fs');
const prettierOptions = require('../prettier.config.js');

async function initTestDir(files) {}

export async function useFixture(fixtureName) {
  const fixturePath = path.join(__dirname, `fixtures/${fixtureName}`);
  const expected = await new Promise(res =>
    fs.readFile(path.join(fixturePath, 'output.js'), (err, data) =>
      res(data.toString())
    )
  );

  return {
    output: await transformFileAsync(path.join(fixturePath, 'code.js'), {
      plugins: [plugin],
      babelrc: false,
    }).then(res => prettier.format(res.code, prettierOptions)),
    expected,
  };
}
