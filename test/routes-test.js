'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('..');
const privates = require('../lib/private-map');

const settings = {
  config: {
    apiVersion: 'v1',
    context:
     {cluster: '192-168-99-100:8443',
       namespace: 'for-node-client-testing',
       user: 'developer/192-168-99-100:8443'},
    user: {token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U'},
    cluster: 'https://192.168.99.100:8443'}
};

test('find - routes - basic findAll', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.routes.findAll, 'function', 'There is a findAll method on the routes object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/routes`)
      .reply(200, {kind: 'RouteList'});

    const findResult = client.routes.findAll().then(routeList => {
      t.equal(routeList.kind, 'RouteList', 'returns an object with RouteList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - routes - basic find', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.routes.find, 'function', 'There is a find method on the routes object');

    const clientConfig = privates.get(client).config;
    const routeName = 'cool-route-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/routes/${routeName}`)
      .reply(200, {kind: 'Route'});

    const findResult = client.routes.find(routeName).then(route => {
      t.equal(route.kind, 'Route', 'returns an object with Route');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - routes - find - no route name', t => {
  openshiftRestClient(settings).then(client => {
    client.routes.find().catch(err => {
      t.equal(err.message, 'Route Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - route', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.routes.create, 'function', 'There is a create method on the routes object');

    const clientConfig = privates.get(client).config;
    const route = {
      kind: 'Route'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/routes`)
      .reply(200, {kind: 'Route'});

    const createResult = client.routes.create(route).then(route => {
      t.equal(route.kind, 'Route', 'returns an object with Route');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - route', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.routes.create, 'function', 'There is a create method on the routes object');

    const clientConfig = privates.get(client).config;
    const route = {
      kind: 'Route'
    };
    const routeName = 'cool-route-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .put(`/oapi/v1/namespaces/${clientConfig.context.namespace}/routes/${routeName}`)
      .reply(200, {kind: 'Route'});

    const createResult = client.routes.update(routeName, route).then(route => {
      t.equal(route.kind, 'Route', 'returns an object with Route');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - routes - update - no route name', t => {
  openshiftRestClient(settings).then(client => {
    client.routes.update().catch(err => {
      t.equal(err.message, 'Route Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - routes - basic removeAll', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.routes.removeAll, 'function', 'There is a removeAll method on the routes object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/routes`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.routes.removeAll().then(routeList => {
      t.equal(routeList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - routes - basic remove', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.routes.remove, 'function', 'There is a remove method on the routes object');

    const clientConfig = privates.get(client).config;
    const routeName = 'cool-route-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/routes/${routeName}`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.routes.remove(routeName).then(status => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - routes - remove - no route name', t => {
  openshiftRestClient(settings).then(client => {
    client.routes.remove().catch(err => {
      t.equal(err.message, 'Route Name is required', 'error message should return');
      t.end();
    });
  });
});
