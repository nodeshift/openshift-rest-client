'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - routes', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.routes.find, 'function', 'There is a find method on the routes object');

      const clientConfig = privates.get(client).config;
      const routesName = 'nodejs-rest-http';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/routes/${routesName}`)
        .reply(200, {kind: 'Route'});

      const findResult = client.routes.find(routesName).then((route) => {
        t.equal(route.kind, 'Route', 'returns an object with Route');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('create - routes', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.routes.create, 'function', 'There is a create method on the routes object');

      const clientConfig = privates.get(client).config;
      const route = {
        kind: 'Route'
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/routes`)
        .reply(200, {kind: 'Route'});

      const createResult = client.routes.create(route).then((route) => {
        t.equal(route.kind, 'Route', 'returns an object with Route');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - routes - basic remove', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.routes.remove, 'function', 'There is a remove method on the routes object');

      const clientConfig = privates.get(client).config;
      const routeName = 'cool-route';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/routes/${routeName}`)
        .reply(200, {kind: 'Status'});

      const removeResult = client.routes.remove(routeName).then((status) => {
        t.equal(status.kind, 'Status', 'returns an object with Status');
        t.end();
      });

      t.equal(removeResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - routes - remove - no route name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.routes.remove().catch((err) => {
        t.equal(err.message, 'Route Name is required', 'error message should return');
        t.end();
      });
    });
  });
});
