# @shipper/fastway

> Please note, this module makes use of the `--harmony_async_await` flag of node

You must register an implementation of `promise-any` to use this module

## Usage

### Definitions

We want to be able to validate our requests, to do this we use [https://spacetelescope.github.io/understanding-json-schema/](JSON Schema)

We need a definition file to to this, it is defined as

```js
const definition = {
  "<controller>": {
    "<version>": {
      "<action>": {
         /* Definition */
         "type": "object"
      }
    }
  }
}
```

You can see an example definition in the root directory of this module

If you don't want to use a definition file you will just need to use `invokeWithVersion` or `getControllerVersioned`

### Methods

#### init

Returns an instance of `Fastway`

```js
const Definition = require('./fastway-definition.json'),
    Fastway = require('@shipper/fastway').init(Definition);
```

#### Fastway.invoke(context, controller, action, data)

Invokes the given action, the highest API version for the controller will be used

```js
async function getConsignmentsForManifest(context, manifestID) {
    const response = Fastway.invoke(context, 'FastLabel', 'ListConsignments', {
        ManifestID: manifestID
    });
    return response.getResult();
}
const context = {
  apiKey: 'Provided by Fastway',
  url: 'http://nz.api.fastway.org/' // Your country specific url
};
getConsignmentsForManifest(1234)
    .then(console.log)
    .catch(console.error);
```

#### Fastway.invokeWithVersion(context, version, controller, action, data)

Same as above, except we will use an explicit API version

```js
async function getConsignmentsForManifest(context, manifestID) {
    const response = Fastway.invokeWithVersion(context, 'v2', 'FastLabel', 'ListConsignments', {
        ManifestID: manifestID
    });
    return response.getResult();
}
const context = {
  apiKey: 'Provided by Fastway',
  url: 'http://nz.api.fastway.org/' // Your country specific url
};
getConsignmentsForManifest(1234)
    .then(console.log)
    .catch(console.error);
```

#### Fastway.getControllerVersioned

You can explicitly define a controller and action if you wish, this is essentially the same as `invokeWithVersion`

```js
Fastway.getControllerVersioned(2, 'FastLabel')
    .invoke(
        context,
        'ListConsignments',
        {
            ManifestID: 1234
        }
    )
    .then(function(response) {
        console.log(response.getResult());
    })
    .catch(console.error);
```

## License

Copyright © 2016 Fabian Cook.

This module (@shipper/fastway) is licenced under the Apache 2.0 license. See the [LICENSE](LICENSE) file for details.