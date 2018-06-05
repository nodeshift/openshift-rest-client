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

test('find - ingress - basic findAll', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.ingress.findAll, 'function', 'There is a findAll method on the ingress object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints().extensions}/namespaces/${clientConfig.context.namespace}/ingresses`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(url).reply(200, {kind: 'IngressList'});

    const findResult = client.ingress.findAll().then(ingressList => {
      t.equal(ingressList.kind, 'IngressList', 'returns an object with IngressList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - ingress - basic find', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.ingress.find, 'function', 'There is a find method on the ingress object');

    const clientConfig = privates.get(client).config;
    const ingressName = 'cool-ingress-name-1';
    const url = `${client.apis.v1beta1.endpoints().extensions}/namespaces/${clientConfig.context.namespace}/ingresses/${ingressName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(url)
      .reply(200, {kind: 'Ingress'});

    const findResult = client.ingress.find(ingressName).then(ingress => {
      t.equal(ingress.kind, 'Ingress', 'returns an object with Ingress');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - ingress - find with no ingress name', (t) => {
  openshiftRestClient(settings).then(client => {
    client.ingress.find().catch(err => {
      t.equal(err.message, 'Ingress Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - ingress', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.ingress.create, 'function', 'There is a create method on the ingress object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints().extensions}/namespaces/${clientConfig.context.namespace}/ingresses`;
    const ingress = {
      kind: 'Ingress'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(url)
      .reply(200, {kind: 'Ingress'});

    const createResult = client.ingress.create(ingress).then(ingress => {
      t.equal(ingress.kind, 'Ingress', 'returns an object with Ingress');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - ingress', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.ingress.create, 'function', 'There is a create method on the ingress object');

    const clientConfig = privates.get(client).config;
    const ingress = {
      kind: 'Ingress'
    };
    const ingressName = 'cool-ingress-name-1';
    const url = `${client.apis.v1beta1.endpoints().extensions}/namespaces/${clientConfig.context.namespace}/ingresses/${ingressName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(url)
      .reply(200, {kind: 'Ingress'});

    const createResult = client.ingress.update(ingressName, ingress).then(updated => {
      t.equal(updated.kind, 'Ingress', 'returns an object with Ingress');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - Ingress with no Ingress name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.ingress.update().catch((err) => {
      t.equal(err.message, 'Ingress Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - ingress - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.ingress.removeAll, 'function', 'There is a removeAll method on the ingress object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints().extensions}/namespaces/${clientConfig.context.namespace}/ingresses`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(url)
      .reply(200, {kind: 'Status'});

    const removeResult = client.ingress.removeAll().then(ingressList => {
      t.equal(ingressList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - ingress - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.ingress.remove, 'function', 'There is a remove method on the ingress object');

    const clientConfig = privates.get(client).config;
    const ingressName = 'cool-ingress-name-1';
    const url = `${client.apis.v1beta1.endpoints().extensions}/namespaces/${clientConfig.context.namespace}/ingresses/${ingressName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(url)
      .reply(200, {kind: 'Status'});

    const removeResult = client.ingress.remove(ingressName).then(status => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - ingress - no ingress name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.ingress.remove().catch((err) => {
      t.equal(err.message, 'Ingress Name is required', 'error message should return');
      t.end();
    });
  });
});
