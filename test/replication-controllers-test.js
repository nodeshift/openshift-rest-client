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

test('find - replicationcontrollers - basic findAll', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.replicationcontrollers.findAll, 'function', 'There is a findAll method on the replicationcontrollers object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/replicationcontrollers`)
      .reply(200, {kind: 'ReplicationControllerList'});

    const findResult = client.replicationcontrollers.findAll().then(replicationControllerList => {
      t.equal(replicationControllerList.kind, 'ReplicationControllerList', 'returns an object with ReplicationControllerList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - replicationcontrollers - basic find', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.replicationcontrollers.find, 'function', 'There is a find method on the replicationcontrollers object');

    const clientConfig = privates.get(client).config;
    const replicationControllerName = 'cool-replicationcontroller-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/replicationcontrollers/${replicationControllerName}`)
      .reply(200, {kind: 'ReplicationController'});

    const findResult = client.replicationcontrollers.find(replicationControllerName).then(replicationcontroller => {
      t.equal(replicationcontroller.kind, 'ReplicationController', 'returns an object with ReplicationController');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - replicationcontrollers - find - no replicationcontroller name', t => {
  openshiftRestClient(settings).then(client => {
    client.replicationcontrollers.find().catch(err => {
      t.equal(err.message, 'Replication Controller Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - replicationcontroller', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.replicationcontrollers.create, 'function', 'There is a create method on the replicationcontrollers object');

    const clientConfig = privates.get(client).config;
    const replicationcontroller = {
      kind: 'ReplicationController'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .post(`/api/v1/namespaces/${clientConfig.context.namespace}/replicationcontrollers`)
      .reply(200, {kind: 'ReplicationController'});

    const createResult = client.replicationcontrollers.create(replicationcontroller).then(replicationcontroller => {
      t.equal(replicationcontroller.kind, 'ReplicationController', 'returns an object with ReplicationController');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - replicationcontroller', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.replicationcontrollers.create, 'function', 'There is a create method on the replicationcontrollers object');

    const clientConfig = privates.get(client).config;
    const replicationcontroller = {
      kind: 'ReplicationController'
    };
    const replicationControllerName = 'cool-replicationcontroller-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .put(`/api/v1/namespaces/${clientConfig.context.namespace}/replicationcontrollers/${replicationControllerName}`)
      .reply(200, {kind: 'ReplicationController'});

    const createResult = client.replicationcontrollers.update(replicationControllerName, replicationcontroller).then(replicationcontroller => {
      t.equal(replicationcontroller.kind, 'ReplicationController', 'returns an object with ReplicationController');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - replicationcontrollers - update - no replicationcontroller name', t => {
  openshiftRestClient(settings).then(client => {
    client.replicationcontrollers.update().catch(err => {
      t.equal(err.message, 'Replication Controller Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - replicationcontrollers - basic removeAll', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.replicationcontrollers.removeAll, 'function', 'There is a removeAll method on the replicationcontrollers object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/replicationcontrollers`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.replicationcontrollers.removeAll().then(replicationControllerList => {
      t.equal(replicationControllerList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - replicationcontrollers - basic remove', t => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.replicationcontrollers.remove, 'function', 'There is a remove method on the replicationcontrollers object');

    const clientConfig = privates.get(client).config;
    const replicationControllerName = 'cool-replicationcontroller-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // Taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/replicationcontrollers/${replicationControllerName}`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.replicationcontrollers.remove(replicationControllerName).then(status => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - replicationcontrollers - remove - no replicationcontroller name', t => {
  openshiftRestClient(settings).then(client => {
    client.replicationcontrollers.remove().catch(err => {
      t.equal(err.message, 'Replication Controller Name is required', 'error message should return');
      t.end();
    });
  });
});
