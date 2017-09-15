'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - build', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.builds.find, 'function', 'There is a find method on the build object');

      const clientConfig = privates.get(client).config;
      const buildName = 'nodejs-rest-http-s2i';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/builds/${buildName}`)
        .reply(200, {kind: 'Build'});

      const findResult = client.builds.find(buildName).then((build) => {
        t.equal(build.kind, 'Build', 'returns an object with Build');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('findall - build', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.builds.find, 'function', 'There is a find method on the build object');

      const clientConfig = privates.get(client).config;

      const buildList = {
        kind: 'BuildList',
        items: [
          {
            metadata: {
              name: 'nodejs-rest-http-s2i-1'
            }
          }
        ]
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/builds`)
        .reply(200, buildList);

      const findResult = client.builds.findAll().then((buildList) => {
        t.equal(buildList.kind, 'BuildList', 'returns an object with Build');
        t.equal(buildList.items[0].metadata.name, 'nodejs-rest-http-s2i-1', 'should have the build name');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - build - basic remove', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.builds.remove, 'function', 'There is a remove method on the build object');

      const clientConfig = privates.get(client).config;
      const buildName = 'cool-deployment-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/builds/${buildName}`)
        .reply(200, {kind: 'Status'});

      const removeResult = client.builds.remove(buildName).then((status) => {
        t.equal(status.kind, 'Status', 'returns an object with Status');
        t.end();
      });

      t.equal(removeResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - build - remove - no build name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.builds.remove().catch((err) => {
        t.equal(err.message, 'Build Name is required', 'error message should return');
        t.end();
      });
    });
  });
});
