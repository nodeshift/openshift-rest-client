'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - buildconfigs - basic findAll', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.buildconfigs.findAll, 'function', 'There is a findAll method on the buildconfigs object');

      const clientConfig = privates.get(client).config;

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/buildconfigs`)
        .reply(200, {kind: 'BuildConfigList'});

      const findResult = client.buildconfigs.findAll().then((buildConfigList) => {
        t.equal(buildConfigList.kind, 'BuildConfigList', 'returns an object with BuildConfigList');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - buildconfigs - basic find', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.buildconfigs.find, 'function', 'There is a find method on the buildconfigs object');

      const clientConfig = privates.get(client).config;
      const buildConfigName = 'cool-buildconfig-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/buildconfigs/${buildConfigName}`)
        .reply(200, {kind: 'BuildConfig'});

      const findResult = client.buildconfigs.find(buildConfigName).then((buildconfig) => {
        t.equal(buildconfig.kind, 'BuildConfig', 'returns an object with BuildConfig');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - buildconfigs - find - no buildconfig name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.buildconfigs.find().catch((err) => {
        t.equal(err.message, 'Build Config Name is required', 'error message should return');
        t.end();
      });
    });
  });
});

test('create - buildconfig', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.buildconfigs.create, 'function', 'There is a create method on the buildconfigs object');

      const clientConfig = privates.get(client).config;
      const buildconfig = {
        kind: 'BuildConfig'
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/buildconfigs`)
        .reply(200, {kind: 'BuildConfig'});

      const createResult = client.buildconfigs.create(buildconfig).then((buildconfig) => {
        t.equal(buildconfig.kind, 'BuildConfig', 'returns an object with BuildConfig');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('update - buildconfig', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.buildconfigs.create, 'function', 'There is a create method on the buildconfigs object');

      const clientConfig = privates.get(client).config;
      const buildconfig = {
        kind: 'BuildConfig'
      };
      const buildConfigName = 'cool-buildconfig-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .put(`/oapi/v1/namespaces/${clientConfig.context.namespace}/buildconfigs/${buildConfigName}`)
        .reply(200, {kind: 'BuildConfig'});

      const createResult = client.buildconfigs.update(buildConfigName, buildconfig).then((buildconfig) => {
        t.equal(buildconfig.kind, 'BuildConfig', 'returns an object with BuildConfig');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - buildconfigs - basic removeAll', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.buildconfigs.removeAll, 'function', 'There is a removeAll method on the buildconfigs object');

      const clientConfig = privates.get(client).config;

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/buildconfigs`)
        .reply(200, {kind: 'Status'});

      const removeResult = client.buildconfigs.removeAll().then((buildConfigList) => {
        t.equal(buildConfigList.kind, 'Status', 'returns an object with Status');
        t.end();
      });

      t.equal(removeResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - buildconfigs - basic remove', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.buildconfigs.remove, 'function', 'There is a remove method on the buildconfigs object');

      const clientConfig = privates.get(client).config;
      const buildConfigName = 'cool-buildconfig-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/buildconfigs/${buildConfigName}`)
        .reply(200, {kind: 'Status'});

      const removeResult = client.buildconfigs.remove(buildConfigName).then((status) => {
        t.equal(status.kind, 'Status', 'returns an object with Status');
        t.end();
      });

      t.equal(removeResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - buildconfigs - remove - no buildconfig name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.buildconfigs.remove().catch((err) => {
        t.equal(err.message, 'Build Config Name is required', 'error message should return');
        t.end();
      });
    });
  });
});
