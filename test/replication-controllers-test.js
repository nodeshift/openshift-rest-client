'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - replication-controller - basic findAll', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.replicationcontrollers.findAll, 'function', 'There is a findAll method on the replicationcontrollers object');

      const clientConfig = privates.get(client).config;

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/api/v1/namespaces/${clientConfig.context.namespace}/replicationcontrollers`)
        .reply(200, {kind: 'ReplicationControllerList'});

      const findResult = client.replicationcontrollers.findAll().then((replicationControllersList) => {
        t.equal(replicationControllersList.kind, 'ReplicationControllerList', 'returns an object with ReplicationControllerList');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - replication-controller - basic find', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.replicationcontrollers.find, 'function', 'There is a find method on the replicationcontrollers object');

      const clientConfig = privates.get(client).config;
      const replicationControllerName = 'cool-deployment-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/api/v1/namespaces/${clientConfig.context.namespace}/replicationcontrollers/${replicationControllerName}`)
        .reply(200, {kind: 'ReplicationController'});

      const findResult = client.replicationcontrollers.find(replicationControllerName).then((replicationController) => {
        t.equal(replicationController.kind, 'ReplicationController', 'returns an object with ReplicationController');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - replication-controller - find - no rep name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.replicationcontrollers.find().catch((err) => {
        t.equal(err.message, 'Replication Controller Name is required', 'error message should return');
        t.end();
      });
    });
  });
});
