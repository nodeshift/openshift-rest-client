[![Build Status](https://travis-ci.org/nodeshift/openshift-rest-client.svg?branch=master)](https://travis-ci.org/nodeshift/openshift-rest-client)  [![Coverage Status](https://coveralls.io/repos/github/nodeshift/openshift-rest-client/badge.svg?branch=master)](https://coveralls.io/github/nodeshift/openshift-rest-client?branch=master)

### Openshift Client

[![Greenkeeper badge](https://badges.greenkeeper.io/nodeshift/openshift-rest-client.svg)](https://greenkeeper.io/)

Node.js based client for the Openshift REST API, not unlike the Fabric8 Maven Plugin, but for node clients/builds.

### Basic Usage

`npm install --save openshift-rest-client`

Code:

    const openshiftRestClient = require('openshift-rest-client');

    openshiftRestClient().then((client) => {
      // Use the client object to find a list of projects, for example
      client.projects.findAll().then((projects) => {
        console.log(projects);
      });
    });


### Advanced Usage

By default, the openshift-rest-client will use the [openshift-config-loader](https://www.npmjs.com/package/openshift-config-loader) module to get your openshift configuration.

You can pass in a custom config object by using the `settings` object

    const openshiftRestClient = require('openshift-rest-client');
    const settings = {};

    const customConfig = {
      apiVersion: 'v1',
      context:
      { cluster: '192-168-99-100:8443',
        namespace: 'for-node-client-testing',
        user: 'developer/192-168-99-100:8443' },
      user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
      cluster: 'https://192.168.99.100:8443' }
    };

    settings.config = customConfig;

    openshiftRestClient(settings).then((client) => {
      // Use the client object to find a list of projects, for example
      client.projects.findAll().then((projects) => {
        console.log(projects);
      });
    });

If you don't have an OpenShift access token, you can use basic authentication by providing username and password as follows:
    
    const openshiftRestClient = require('openshift-rest-client');
    const settings = {};

    const customConfig = {
      apiVersion: 'v1',
      context:
      { cluster: '192-168-99-100:8443',
        namespace: 'for-node-client-testing',
        user: 'developer/192-168-99-100:8443' },
      user: { 
        username: yourUsername,
        password: youPassword 
      },
      cluster: 'https://192.168.99.100:8443' }
    };

    settings.config = customConfig;

    openshiftRestClient(settings).then((client) => {
      // Use the client object to find a list of projects, for example
      client.projects.findAll().then((projects) => {
        console.log(projects);
      });
    });


