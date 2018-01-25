'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - clusterrolebindings - basic findAll', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.clusterrolebindings.findAll, 'function', 'There is a findAll method on the clusterrolebindings object');

      const clientConfig = privates.get(client).config;

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/clusterrolebindings`)
        .reply(200, {kind: 'ClusterRoleBindingList'});

      const findResult = client.clusterrolebindings.findAll().then((clusterRoleBindingList) => {
        t.equal(clusterRoleBindingList.kind, 'ClusterRoleBindingList', 'returns an object with ClusterRoleBindingList');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - clusterrolebindings - basic find', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.clusterrolebindings.find, 'function', 'There is a find method on the clusterrolebindings object');

      const clientConfig = privates.get(client).config;
      const clusterRoleBindingName = 'cool-clusterrolebinding-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/clusterrolebindings/${clusterRoleBindingName}`)
        .reply(200, {kind: 'ClusterRoleBinding'});

      const findResult = client.clusterrolebindings.find(clusterRoleBindingName).then((clusterrolebinding) => {
        t.equal(clusterrolebinding.kind, 'ClusterRoleBinding', 'returns an object with ClusterRoleBinding');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - clusterrolebindings - find - no clusterrolebinding name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.clusterrolebindings.find().catch((err) => {
        t.equal(err.message, 'Cluster Role Binding Name is required', 'error message should return');
        t.end();
      });
    });
  });
});

test('create - clusterrolebinding', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.clusterrolebindings.create, 'function', 'There is a create method on the clusterrolebindings object');

      const clientConfig = privates.get(client).config;
      const clusterrolebinding = {
        kind: 'ClusterRoleBinding'
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .post(`/oapi/v1/clusterrolebindings`)
        .reply(200, {kind: 'ClusterRoleBinding'});

      const createResult = client.clusterrolebindings.create(clusterrolebinding).then((clusterrolebinding) => {
        t.equal(clusterrolebinding.kind, 'ClusterRoleBinding', 'returns an object with ClusterRoleBinding');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - clusterrolebindings - basic remove', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.clusterrolebindings.remove, 'function', 'There is a remove method on the clusterrolebindings object');

      const clientConfig = privates.get(client).config;
      const clusterRoleBindingName = 'cool-clusterrolebinding-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .delete(`/oapi/v1/clusterrolebindings/${clusterRoleBindingName}`)
        .reply(200, {kind: 'Status'});

      const removeResult = client.clusterrolebindings.remove(clusterRoleBindingName).then((status) => {
        t.equal(status.kind, 'Status', 'returns an object with Status');
        t.end();
      });

      t.equal(removeResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - clusterrolebindings - remove - no clusterrolebinding name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.clusterrolebindings.remove().catch((err) => {
        t.equal(err.message, 'Cluster Role Binding Name is required', 'error message should return');
        t.end();
      });
    });
  });
});
