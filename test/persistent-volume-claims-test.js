'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const privates = require('../lib/private-map');

const settings = {
  config: {
    apiVersion: 'v1',
    context:
     { cluster: '192-168-99-100:8443',
       namespace: 'for-node-client-testing',
       user: 'developer/192-168-99-100:8443' },
    user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
    cluster: 'https://192.168.99.100:8443' }
};

test('find - persistent volume claims - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.persistentvolumeclaims.findAll, 'function', 'There is a findAll method on the persistent volume claims object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/persistentvolumeclaims`)
      .reply(200, {kind: 'List'});

    const findResult = client.persistentvolumeclaims.findAll().then((pvcList) => {
      t.equal(pvcList.kind, 'List', 'returns an object with List');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - persistent volume claims - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.persistentvolumeclaims.find, 'function', 'There is a find method on the persistent volume claims object');

    const clientConfig = privates.get(client).config;
    const pvcName = 'cool-pvc-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/persistentvolumeclaims/${pvcName}`)
      .reply(200, {kind: 'PersistentVolumeClaim'});

    const findResult = client.persistentvolumeclaims.find(pvcName).then((pvc) => {
      t.equal(pvc.kind, 'PersistentVolumeClaim', 'returns an object with PersistentVolumeClaim');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - persistent volume claims - find - no claim name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.persistentvolumeclaims.find().catch((err) => {
      t.equal(err.message, 'Claim Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - persistent volume claims', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.persistentvolumeclaims.create, 'function', 'There is a create method on the persistent volume claims object');

    const clientConfig = privates.get(client).config;
    const pvc = {
      kind: 'PersistentVolumeClaim',
      spec: { resources: { requests: { storage: '42Mi' } } }
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/api/v1/namespaces/${clientConfig.context.namespace}/persistentvolumeclaims`)
      .reply(200, {kind: 'PersistentVolumeClaim'});

    const createResult = client.persistentvolumeclaims.create(pvc).then((opvc) => {
      t.equal(opvc.kind, 'PersistentVolumeClaim', 'returns an object with PersistentVolumeClaims');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - persistent volume claims', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.persistentvolumeclaims.create, 'function', 'There is a create method on the persistent volume claims object');

    const clientConfig = privates.get(client).config;
    const pvc = {
      kind: 'PersistentVolumeClaim'
    };
    const pvcName = 'cool-pvc-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(`/api/v1/namespaces/${clientConfig.context.namespace}/persistentvolumeclaims/${pvcName}`)
      .reply(200, {kind: 'PersistentVolumeClaim'});

    const createResult = client.persistentvolumeclaims.update(pvcName, pvc).then((opvc) => {
      t.equal(opvc.kind, 'PersistentVolumeClaim', 'returns an object with PersistentVolumeClaim');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - persistent volume claims - update - no claim name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.persistentvolumeclaims.update().catch((err) => {
      t.equal(err.message, 'Claim Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - persistent volume claims - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.persistentvolumeclaims.removeAll, 'function', 'There is a removeAll method on the persistent volume claims object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/persistentvolumeclaims`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.persistentvolumeclaims.removeAll().then((rresult) => {
      t.equal(rresult.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - persistent volume claims - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.persistentvolumeclaims.remove, 'function', 'There is a remove method on the persistent volume claims object');

    const clientConfig = privates.get(client).config;
    const pvcName = 'cool-pvc-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/persistentvolumeclaims/${pvcName}`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.persistentvolumeclaims.remove(pvcName).then((status) => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - persistent volume claims - remove - no claim name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.persistentvolumeclaims.remove().catch((err) => {
      t.equal(err.message, 'Claim Name is required', 'error message should return');
      t.end();
    });
  });
});
