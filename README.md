# babel-plugin-import-dir

Babel plugin to allow importing all modules in subdirectories of a folder. Supports babel >= 7.


## Usage

Enable the plugin in `.babelrc`:
```json
{
  "plugins": ["babel-plugin-import-dir"]
}
```

Let's say you have such a folder structure, and wish to export `a`, `b` and `c` from `top/index.js`:
```
top/
- a/
  - index.js
- b/
  - index.js
- c/
  - index.js
index.js
```

In `top/index.js`:
```js
import modules from './*';

export default modules;
```

This is roughly transformed into:
```js
import a from './a';
import b from './b';
import c from './c';

const modules = {
  a, b, c
}

export default modules;
```

You can now use it in another file:
```js
import * as modules from './top';

console.log(modules);
```

