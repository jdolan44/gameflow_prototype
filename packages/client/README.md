# GameFlow Client Library
The package contains a simple library for connecting to the GameFlow server.

## Connecting a Client in Static Files
1. Run "npm build" in this project directory. This will generate a "dist" folder.
2. Clients will then reference the browser distribution file as shown below:

```js
import {Client} from 'packages/client/dist/browser.js';
```

This is done because of the nature of static sites: they cannot locally reference files from NPM. Typically to work around this, packages provide a CDN. Due to the scope of the project it isn't feasible to make a CDN, but this has a similar effect.