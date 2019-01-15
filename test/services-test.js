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

test('find - services - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.services.findAll, 'function', 'There is a findAll method on the services object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/services`)
      .reply(200, { kind: 'ServiceList' });

    const findResult = client.services.findAll().then((serviceList) => {
      t.equal(serviceList.kind, 'ServiceList', 'returns an object with ServiceList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - services - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.services.find, 'function', 'There is a find method on the services object');

    const clientConfig = privates.get(client).config;
    const serviceName = 'cool-service-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/services/${serviceName}`)
      .reply(200, { kind: 'Service' });

    const findResult = client.services.find(serviceName).then((service) => {
      t.equal(service.kind, 'Service', 'returns an object with Service');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - services - find - no service name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.services.find().catch((err) => {
      t.equal(err.message, 'Service Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - service', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.services.create, 'function', 'There is a create method on the services object');

    const clientConfig = privates.get(client).config;
    const service = {
      kind: 'Service'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/api/v1/namespaces/${clientConfig.context.namespace}/services`)
      .reply(200, { kind: 'Service' });

    const createResult = client.services.create(service).then((service) => {
      t.equal(service.kind, 'Service', 'returns an object with Service');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - service', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.services.create, 'function', 'There is a create method on the services object');

    const clientConfig = privates.get(client).config;
    const service = {
      kind: 'Service'
    };
    const serviceName = 'cool-service-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(`/api/v1/namespaces/${clientConfig.context.namespace}/services/${serviceName}`)
      .reply(200, { kind: 'Service' });

    const createResult = client.services.update(serviceName, service).then((service) => {
      t.equal(service.kind, 'Service', 'returns an object with Service');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - services - update - no service name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.services.update().catch((err) => {
      t.equal(err.message, 'Service Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - services - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.services.removeAll, 'function', 'There is a removeAll method on the services object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/services`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.services.removeAll().then((serviceList) => {
      t.equal(serviceList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - services - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.services.remove, 'function', 'There is a remove method on the services object');

    const clientConfig = privates.get(client).config;
    const serviceName = 'cool-service-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/services/${serviceName}`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.services.remove(serviceName).then((status) => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - services - remove - no service name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.services.remove().catch((err) => {
      t.equal(err.message, 'Service Name is required', 'error message should return');
      t.end();
    });
  });
});
