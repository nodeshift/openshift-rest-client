'use strict';

const test = require('tape');
const privates = require('../lib/private-map');
const proxyquire = require('proxyquire');

test('test loading config as settings', (t) => {
  const configLoader = proxyquire('../lib/config-loader', {
    'openshift-config-loader': () => {
      t.fail('should not call this method');
      return Promise.reject(new Error('reject'));
    }
  });
  t.plan(7);
  const client = {
    settings: {
      config: {
        apiVersion: 'v1',
        context:
         { cluster: '192-168-99-100:8443',
           namespace: 'for-node-client-testing',
           user: 'developer/192-168-99-100:8443' },
        user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
        cluster: 'https://192.168.99.100:8443' }
    }
  };

  privates.set(client, {});

  configLoader(client).then((config) => {
    t.equals(config.apiUrl, 'https://192.168.99.100:8443/oapi/v1', 'apiUrl should be https://192.168.99.100:8443/oapi/v1');
    t.equals(config.kubeUrl, 'https://192.168.99.100:8443/api/v1', 'kubeUrl should be https://192.168.99.100:8443/api/v1');
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

test('test loading config - default', (t) => {
  const configLoader = proxyquire('../lib/config-loader', {
    'openshift-config-loader': () => {
      t.pass('default should call this method');
      return Promise.resolve({
        apiVersion: 'v1',
        context:
         { cluster: '192-168-99-100:8443',
           namespace: 'for-node-client-testing',
           user: 'developer/192-168-99-100:8443' },
        user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
        cluster: 'https://192.168.99.100:8443'
      });
    }
  });

  t.plan(8);

  const client = {
    settings: {}
  };

  privates.set(client, {});

  configLoader(client).then((config) => {
    t.equals(config.apiUrl, 'https://192.168.99.100:8443/oapi/v1', 'apiUrl should be https://192.168.99.100:8443/oapi/v1');
    t.equals(config.kubeUrl, 'https://192.168.99.100:8443/api/v1', 'kubeUrl should be https://192.168.99.100:8443/api/v1');
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

// test('test loading of config, error', (t) => {
//   const openshiftRestClient = require('../');

//   openshiftRestClient().catch((err) => {
//     t.equal(err.message, 'Config object is require', 'Should throw an error for not finding the config file');
//     t.end();
//   });
// });
