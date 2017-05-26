'use strict';

const test = require('tape');
const privates = require('../lib/private-map');
const openshiftConfigLoader = require('openshift-config-loader');

test('test loading config', (t) => {
  const openshiftRestClient = require('../');
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equals(client.apiUrl, 'https://192.168.99.100:8443/oapi/v1', 'apiUrl should be https://192.168.99.100:8443/oapi/v1');
      t.equals(client.kubeUrl, 'https://192.168.99.100:8443/api/v1', 'kubeUrl should be https://192.168.99.100:8443/api/v1');
      const clientConfig = privates.get(client).config;
      // context cluster object
      t.ok(clientConfig.context.cluster, 'should have the context cluster prop');
      t.ok(clientConfig.context.namespace, 'should have the context namespace prop');
      t.ok(clientConfig.context.user, 'should have the context user prop');

      // context user object
      t.ok(clientConfig.user.token, 'should have the user token prop');
      t.ok(clientConfig.cluster, 'should have the cluster prop');
      t.end();
    });
  });
});

test('test loading of config, error', (t) => {
  const openshiftRestClient = require('../');

  openshiftRestClient().catch((err) => {
    t.equal(err.message, 'Config object is require', 'Should throw an error for not finding the config file');
    t.end();
  });
});
