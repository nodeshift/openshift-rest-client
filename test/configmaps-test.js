'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - configmaps - basic find', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.configmaps.find, 'function', 'There is a find method on the configmaps object');

      const clientConfig = privates.get(client).config;
      const configMapName = 'cool-deployment-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/api/v1/namespaces/${clientConfig.context.namespace}/configmaps/${configMapName}`)
        .reply(200, {kind: 'ConfigMap'});

      const findResult = client.configmaps.find(configMapName).then((configMap) => {
        t.equal(configMap.kind, 'ConfigMap', 'returns an object with configMap');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - configmaps - find - no configMap name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.configmaps.find().catch((err) => {
        t.equal(err.message, 'ConfigMap Name is required', 'error message should return');
        t.end();
      });
    });
  });
});
