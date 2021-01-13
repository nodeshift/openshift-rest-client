![Node.js CI](https://github.com/nodeshift/openshift-rest-client/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/nodeshift/openshift-rest-client/badge.svg?branch=master)](https://coveralls.io/github/nodeshift/openshift-rest-client?branch=master)
[![Greenkeeper badge](https://badges.greenkeeper.io/nodeshift/openshift-rest-client.svg)](https://greenkeeper.io/)

### Openshift Client

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

If needed, [Query Parameters](https://docs.openshift.com/container-platform/3.11/rest_api/apis-project.openshift.io/v1.Project.html#query-parameters-3) can be used:

```js
const projects = await client.apis['project.openshift.io'].v1.projects.get({qs: {labelSelector: 'someOpenShiftLabel'}})
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

    const config = '~/some/path/config';

    openshiftRestClient({ config }).then((client) => {
      // Use the client object to find a list of projects, for example
      client.apis['project.openshift.io'].v1.project.get().then((response) => {
        console.log(response.body);
      });
    });

You can also pass a plain object or a [KubeConfig](https://github.com/nodeshift/openshift-rest-client/blob/049059de652d9467b342f465a9394f321fc960bf/index.js#L23) object.

An example of a plain object:

```
    const openshiftRestClient = require('openshift-rest-client').OpenshiftClient;
    const k8Config = require('openshift-rest-client').config;

    const config = {
      apiVersion: 'v1',
      kind: 'Config',
      clusters: [
          {
            name: 'cluster',
            cluster: {
              skipTLSVerify: true,
              server: 'server-time'
            }
          }
        ],
        users: [{ name: 'user', token: '123456' }],
        contexts: [
          {
            context: {
              user: 'user',
              cluster: 'cluster'
            },
            name: 'context'
          }
        ],
        'current-context': 'context'
      };

    openshiftRestClient({config}).then((client) => {
      console.log(client);
    });
```

An example of a KubeConfig object:

```
    const openshiftRestClient = require('openshift-rest-client').OpenshiftClient;
    const k8Config = require('openshift-rest-client').config;

    const config = {
      apiVersion: 'v1',
      kind: 'Config',
      clusters: [
          {
            name: 'cluster',
            cluster: {
              skipTLSVerify: true,
              server: 'server-time'
            }
          }
        ],
        users: [{ name: 'user', token: '123456' }],
        contexts: [
          {
            context: {
              user: 'user',
              cluster: 'cluster'
            },
            name: 'context'
          }
        ],
        'current-context': 'context'
      };

      k8Config.loadFromString(JSON.stringify(config));


      openshiftRestClient({config: k8Config}).then((client) => {
        console.log(client);
      });
```


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

It is also possible to send in a valid auth token instead of a username/password.  If we use the above example,  the settings object might look something like this:

```
const settings = {
  };

settings.config = {
  url: process.env.CLUSTER_URL,
  auth: {
    token: process.env.TOKEN
  },
  insecureSkipTlsVerify: true
};
```

To see more examples of how to customize your config, check out the [kubernetes-client Initializing section](https://www.npmjs.com/package/kubernetes-client#initializing)

#### Load API from a Remote Cluster

By default, the openshift-rest-client, will load a swagger spec file that is included with the module.  This has all the basic API's that come with Openshift and Kubernetes.  If you are using operators to extend your cluster, the openshift-rest-client, by default, won't know about them.

To fix this, you can tell the openshift-rest-client to load the spec file from your remote cluster using the `loadSpecFromCluster` option.  Setting this to true, will try to load the spec file from your clusters `/openapi/v2` endpoint.  If that doesn't exist, it will also try, `/swagger.json`

If the remote spec cannot be loaded,  a warning will be output to the console and the default spec will be loaded.

In a future version of this client,  this might become the default.



#### Changes in 2.0

The client has been totally rewritten for the 2.0 release.  This includes a new, more fluent, API.

The old API will live in the 1.x branch.
