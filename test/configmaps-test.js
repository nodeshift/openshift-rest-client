'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - configmaps - basic findAll', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.configmaps.findAll, 'function', 'There is a findAll method on the configmaps object');

      const clientConfig = privates.get(client).config;

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/api/v1/namespaces/${clientConfig.context.namespace}/configmaps`)
        .reply(200, {kind: 'ConfigMapList'});

      const findResult = client.configmaps.findAll().then((configMapList) => {
        t.equal(configMapList.kind, 'ConfigMapList', 'returns an object with ConfigMapList');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - configmaps - basic find', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.configmaps.find, 'function', 'There is a find method on the configmaps object');

      const clientConfig = privates.get(client).config;
      const configMapName = 'cool-configmap-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/api/v1/namespaces/${clientConfig.context.namespace}/configmaps/${configMapName}`)
        .reply(200, {kind: 'ConfigMap'});

      const findResult = client.configmaps.find(configMapName).then((configmap) => {
        t.equal(configmap.kind, 'ConfigMap', 'returns an object with ConfigMap');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - configmaps - find - no configmap name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.configmaps.find().catch((err) => {
        t.equal(err.message, 'Config Map Name is required', 'error message should return');
        t.end();
      });
    });
  });
});

test('create - configmap', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.configmaps.create, 'function', 'There is a create method on the configmaps object');

      const clientConfig = privates.get(client).config;
      const configmap = {
        kind: 'ConfigMap'
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .post(`/api/v1/namespaces/${clientConfig.context.namespace}/configmaps`)
        .reply(200, {kind: 'ConfigMap'});

      const createResult = client.configmaps.create(configmap).then((configmap) => {
        t.equal(configmap.kind, 'ConfigMap', 'returns an object with ConfigMap');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('update - configmap', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.configmaps.create, 'function', 'There is a create method on the configmaps object');

      const clientConfig = privates.get(client).config;
      const configmap = {
        kind: 'ConfigMap'
      };
      const configMapName = 'cool-configmap-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .put(`/api/v1/namespaces/${clientConfig.context.namespace}/configmaps/${configMapName}`)
        .reply(200, {kind: 'ConfigMap'});

      const createResult = client.configmaps.update(configMapName, configmap).then((configmap) => {
        t.equal(configmap.kind, 'ConfigMap', 'returns an object with ConfigMap');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - configmaps - basic removeAll', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.configmaps.removeAll, 'function', 'There is a removeAll method on the configmaps object');

      const clientConfig = privates.get(client).config;

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/configmaps`)
        .reply(200, {kind: 'Status'});

      const removeResult = client.configmaps.removeAll().then((configMapList) => {
        t.equal(configMapList.kind, 'Status', 'returns an object with Status');
        t.end();
      });

      t.equal(removeResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - configmaps - basic remove', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.configmaps.remove, 'function', 'There is a remove method on the configmaps object');

      const clientConfig = privates.get(client).config;
      const configMapName = 'cool-configmap-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/configmaps/${configMapName}`)
        .reply(200, {kind: 'Status'});

      const removeResult = client.configmaps.remove(configMapName).then((status) => {
        t.equal(status.kind, 'Status', 'returns an object with Status');
        t.end();
      });

      t.equal(removeResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - configmaps - remove - no configmap name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.configmaps.remove().catch((err) => {
        t.equal(err.message, 'Config Map Name is required', 'error message should return');
        t.end();
      });
    });
  });
});
