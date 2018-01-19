[![Build Status](https://travis-ci.org/bucharest-gold/openshift-rest-client.svg?branch=master)](https://travis-ci.org/bucharest-gold/openshift-rest-client)  [![Coverage Status](https://coveralls.io/repos/github/bucharest-gold/openshift-rest-client/badge.svg?branch=master)](https://coveralls.io/github/bucharest-gold/openshift-rest-client?branch=master)

### Openshift Client

[![Greenkeeper badge](https://badges.greenkeeper.io/bucharest-gold/openshift-rest-client.svg)](https://greenkeeper.io/)

Node.js based client for the Openshift REST API, not unlike the Fabric8 Maven Plugin, but for node clients/builds.

### Usage

`npm install --save openshift-rest-client`

The client needs to be passed a `config` object with the follow properties:

    { apiVersion: 'v1',
    context:
     { cluster: '192-168-99-100:8443',
       namespace: 'for-node-client-testing',
       user: 'developer/192-168-99-100:8443' },
    user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
    cluster: 'https://192.168.99.100:8443' }

This can be obtained using the [openshift-config-loader](https://www.npmjs.com/package/openshift-config-loader)

By default, the config loader with look for a config at `~/.kube/config`


Code:

    const openshiftConfigLoader = require('openshift-config-loader');
    const openshiftRestClient = require('openshift-rest-client');

    openshiftConfigLoader(settings).then((config) => {
      openshiftRestClient(config).then((client) => {
        // Use the client object to find a list of projects, for example
        client.projects.findAll().then((projects) => {
          console.log(projects);
        });
      });
    });
