# babel-plugin-import-dir

Babel plugin to allow importing all modules in subdirectories of a folder. Zero configuration. Supports babel >= 7.


## Usage

Enable the plugin in `.babelrc`:
```json
{
  "plugins": ["babel-plugin-import-dir"]
}
```

#### Basic example
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

#### Import directly from `top/`:
```js
import modules from './top/*';

console.log(modules);  // {a: <module 'a'>, b: <mobule 'b'>, c: <module 'c'>}
```


#### Directories with kebab-cased names will be converted into camelCase
```
top/
- kebab-case/
  - index.js
- b/
  - index.js
- c/
  - index.js
index.js
```
```js
import modules from './top/*'

console.log(modules);  // {kebabCase: <module 'kebab-case'>, b: <mobule 'b'>, c: <module 'c'>}
```

## Caveats

- Only single-level directory imports are supported.
This means you can't do something like:

```js
import modules from './**/*'
```

- If you are running a file watcher (e.g. watchman, nodemon) in development, changes to directory names might not be picked up by babel. If this happens, restarting your development script should do the trick.