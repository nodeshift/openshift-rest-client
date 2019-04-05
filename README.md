[![Build Status](https://travis-ci.org/nodeshift/openshift-rest-client.svg?branch=master)](https://travis-ci.org/nodeshift/openshift-rest-client)  [![Coverage Status](https://coveralls.io/repos/github/nodeshift/openshift-rest-client/badge.svg?branch=master)](https://coveralls.io/github/nodeshift/openshift-rest-client?branch=master)

### Openshift Client

[![Greenkeeper badge](https://badges.greenkeeper.io/nodeshift/openshift-rest-client.svg)](https://greenkeeper.io/)

Node.js based client for the Openshift REST API, not unlike the Fabric8 Maven Plugin, but for node clients/builds.

### Basic Usage

`npm install --save openshift-rest-client`

Code:

    const openshiftRestClient = require('openshift-rest-client').OpenshiftClient;

    openshiftRestClient().then((client) => {
      // Use the client object to find a list of projects, for example
      client.apis['project.openshift.io'].v1.projects.get().then((response) => {
        console.log(response.body);
      });
    });


The openshift-rest-client translates Path Item Objects \[[1]\] (*e.g*.,
`/apis/project.openshift.io/v1/projects`) to object chains ending in HTTP methods (*e.g.*,
`apis['project.openshift.io'].v1.projects.get`).

So, to fetch all Projects:

```js
const projects = await client.apis['project.openshift.io'].v1.projects.get()
```

The openshift-rest-client translates Path Templating \[[2]\] (*e.g.*,
`/apis/build.openshift.io/v1/namespaces/$NAMESPACE/buildconfigs`) to function calls (*e.g.*,
`apis['build.openshift.io'].v1.namespaces('default').buildconfigs`).

So, to create a new Build Config in the default Namespace:

```js
const buildConfig = require('./build-config.json')
const create = await client.apis['build.openshift.io'].v1.namespaces('default').buildconfigs.post({ body: buildConfig })
```

and then fetch your newly created Build Config:

```js
const deployment = await client.apis['build.openshift.io'].v1.namespaces('default').buildconfigs(buildConfig.metadata.name).get()
```

and finally, remove the Build Config:

```js
await client.apis['build.openshift.io'].v1.namespaces('default').buildconfigs(buildConfig.metadata.name).delete()
```

The openshift-rest-client supports `.delete`, `.get`, `.patch`, `.post`, and `.put`.

There are also aliases defined, so instead of writing `client.apis['build.openshift.io']`, you can just use `client.apis.build` for example.  The list of aliases can be seen here: https://github.com/nodeshift/openshift-rest-client/blob/master/lib/openshift-rest-client.js

### Advanced Usage

By default, the openshift-rest-client will use the [kubernetes-client](https://www.npmjs.com/package/kubernetes-client) module to get your configuration.

The openshift-rest-client exposes the config module from the kubernetes client for ease of use.

For example, if you want to provide a different path to your configuration, you can do something like this:

    const openshiftRestClient = require('openshift-rest-client').OpenshiftClient;
    const config = require('openshift-rest-client').config;

    const path '~/some/path/config';
    const customConfig = config.fromKubeconfig(path);

    openshiftRestClient({config: customConfig}).then((client) => {
      // Use the client object to find a list of projects, for example
      client.apis['project.openshift.io'].v1.project.get().then((response) => {
        console.log(response.body);
      });
    });


If you want to use a username/password combo to authenticate to Openshift, you might do something like this:

```
const openshiftRestClient = require('openshift-rest-client').OpenshiftClient;


(async function () {
  const settings = {
  };

  settings.config = {
    url: process.env.CLUSTER_URL,
    auth: {
      username: process.env.ADMIN_USERNAME,
      password: process.env.ADMIN_PASSWORD
    },
    insecureSkipTlsVerify: true
  };

  const client = await openshiftRestClient(settings);

  const projects = await client.apis['build.openshift.io'].v1.ns('myproject').builds.get();
  console.log(projects);
})();
```

To see more examples of how to customize your config, check out the [kubernetes-client Initializing section](https://www.npmjs.com/package/kubernetes-client#initializing)



#### Changes in 2.0

The client has been totally rewritten for the 2.0 release.  This includes a new, more fluent, API.

The old API will live in the 1.x branch.
