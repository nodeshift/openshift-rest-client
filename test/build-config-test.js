'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - build-config', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.buildconfigs.find, 'function', 'There is a find method on the buildconfigs object');

      const clientConfig = privates.get(client).config;
      const buildConfigName = 'nodejs-rest-http-s2i';

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

test('find - build-config - not found', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      const clientConfig = privates.get(client).config;
      const buildConfigName = 'nodejs-rest-http-s2i-not-here';

      const mockedErrorMessage = {
        kind: 'Status',
        apiVersion: 'v1',
        metadata: {},
        status: 'Failure',
        message: 'buildconfigs "nodejs-rest-http-s2i-not-here" not found',
        reason: 'NotFound',
        details: { name: 'nodejs-rest-http-s2i-not-here', kind: 'buildconfigs' },
        code: 404
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/buildconfigs/${buildConfigName}`)
        .reply(200, mockedErrorMessage);

      client.buildconfigs.find(buildConfigName).then((buildconfig) => {
        t.equal(buildconfig.kind, 'Status', 'returns an object with Status');
        t.equal(buildconfig.code, 404, 'code with a 404');
        t.end();
      });
    });
  });
});

test('create a build-config', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.buildconfigs.create, 'function', 'There is a create method on the buildconfigs object');

      const clientConfig = privates.get(client).config;
      const buildConfigName = 'nodejs-rest-http-s2i-test';

      const buildConfig = {
        apiVersion: 'v1',
        kind: 'BuildConfig',
        metadata: {
          name: buildConfigName,
          namespace: clientConfig.context.namespace
        }
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/buildconfigs`)
        .reply(201, buildConfig);

      const createResult = client.buildconfigs.create(buildConfig).then((buildconfig) => {
        t.equal(buildconfig.kind, 'BuildConfig', 'returns an object with BuildConfig');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});
