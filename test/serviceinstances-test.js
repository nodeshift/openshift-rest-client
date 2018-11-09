'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const privates = require('../lib/private-map');

const settings = {
  config: {
    apiVersion: 'v1beta1',
    context:
     { cluster: '192-168-99-100:8443',
       namespace: 'for-node-client-testing',
       user: 'developer/192-168-99-100:8443' },
    user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
    cluster: 'https://192.168.99.100:8443' }
};

test('find - serviceinstances - basic findAll', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.serviceinstances.findAll, 'function', 'There is a findAll method on the serviceinstances object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints()['servicecatalog.k8s.io']}/namespaces/${clientConfig.context.namespace}/serviceinstances`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(url).reply(200, {kind: 'ServiceInstanceList'});

    const findResult = client.serviceinstances.findAll().then(serviceInstanceList => {
      t.equal(serviceInstanceList.kind, 'ServiceInstanceList', 'returns an object with ServiceInstanceList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - serviceinstances - basic find', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.serviceinstances.find, 'function', 'There is a find method on the serviceinstances object');

    const clientConfig = privates.get(client).config;
    const serviceInstanceName = 'cool-serviceinstance-name-1';
    const url = `${client.apis.v1beta1.endpoints()['servicecatalog.k8s.io']}/namespaces/${clientConfig.context.namespace}/serviceinstances/${serviceInstanceName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(url)
      .reply(200, {kind: 'ServiceInstance'});

    const findResult = client.serviceinstances.find(serviceInstanceName).then(serviceInstance => {
      t.equal(serviceInstance.kind, 'ServiceInstance', 'returns an object with ServiceInstance');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - serviceinstances - find with no serviceinstance name', (t) => {
  openshiftRestClient(settings).then(client => {
    client.serviceinstances.find().catch(err => {
      t.equal(err.message, 'Service Instance name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - serviceinstance', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.serviceinstances.create, 'function', 'There is a create method on the serviceinstances object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints()['servicecatalog.k8s.io']}/namespaces/${clientConfig.context.namespace}/serviceinstances`;
    const serviceInstance = {
      kind: 'ServiceInstance'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(url)
      .reply(200, {kind: 'ServiceInstance'});

    const createResult = client.serviceinstances.create(serviceInstance).then(serviceInstance => {
      t.equal(serviceInstance.kind, 'ServiceInstance', 'returns an object with ServiceInstance');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - serviceinstance', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.serviceinstances.create, 'function', 'There is a create method on the serviceinstances object');

    const clientConfig = privates.get(client).config;
    const serviceInstance = {
      kind: 'ServiceInstance'
    };
    const serviceInstanceName = 'cool-serviceinstance-name-1';
    const url = `${client.apis.v1beta1.endpoints()['servicecatalog.k8s.io']}/namespaces/${clientConfig.context.namespace}/serviceinstances/${serviceInstanceName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(url)
      .reply(200, {kind: 'ServiceInstance'});

    const createResult = client.serviceinstances.update(serviceInstanceName, serviceInstance).then(updated => {
      t.equal(updated.kind, 'ServiceInstance', 'returns an object with ServiceInstance');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - serviceinstance with no serviceinstance name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.serviceinstances.update().catch((err) => {
      t.equal(err.message, 'Service Instance name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - serviceinstances - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.serviceinstances.removeAll, 'function', 'There is a removeAll method on the serviceinstances object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints()['servicecatalog.k8s.io']}/namespaces/${clientConfig.context.namespace}/serviceinstances`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(url)
      .reply(200, {kind: 'Status'});

    const removeResult = client.serviceinstances.removeAll().then(serviceInstanceList => {
      t.equal(serviceInstanceList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - serviceinstances - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.serviceinstances.remove, 'function', 'There is a remove method on the serviceinstances object');

    const clientConfig = privates.get(client).config;
    const serviceInstanceName = 'cool-serviceinstance-name-1';
    const url = `${client.apis.v1beta1.endpoints()['servicecatalog.k8s.io']}/namespaces/${clientConfig.context.namespace}/serviceinstances/${serviceInstanceName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(url)
      .reply(200, {kind: 'Status'});

    const removeResult = client.serviceinstances.remove(serviceInstanceName).then(status => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - serviceinstance - no serviceinstance name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.serviceinstances.remove().catch((err) => {
      t.equal(err.message, 'Service Instance name is required', 'error message should return');
      t.end();
    });
  });
});
