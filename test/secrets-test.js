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

test('find - secrets - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.secrets.findAll, 'function', 'There is a findAll method on the secrets object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/secrets`)
      .reply(200, {kind: 'SecretList'});

    const findResult = client.secrets.findAll().then((secretsList) => {
      t.equal(secretsList.kind, 'SecretList', 'returns an object with SecretList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - secrets - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.secrets.find, 'function', 'There is a find method on the secrets object');

    const clientConfig = privates.get(client).config;
    const secretName = 'cool-deployment-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/secrets/${secretName}`)
      .reply(200, {kind: 'Secret'});

    const findResult = client.secrets.find(secretName).then((secret) => {
      t.equal(secret.kind, 'Secret', 'returns an object with Secret');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - secrets - find - no secret name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.secrets.find().catch((err) => {
      t.equal(err.message, 'Secret Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - secret', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.secrets.create, 'function', 'There is a create method on the secrets object');

    const clientConfig = privates.get(client).config;
    const secret = {
      kind: 'Secret'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/api/v1/namespaces/${clientConfig.context.namespace}/secrets`)
      .reply(200, {kind: 'Secret'});

    const createResult = client.secrets.create(secret).then((secret) => {
      t.equal(secret.kind, 'Secret', 'returns an object with Secret');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - secret', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.secrets.create, 'function', 'There is a create method on the secrets object');

    const clientConfig = privates.get(client).config;
    const secret = {
      kind: 'Secret'
    };
    const secretName = 'cool-deployment-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(`/api/v1/namespaces/${clientConfig.context.namespace}/secrets/${secretName}`)
      .reply(200, {kind: 'Secret'});

    const createResult = client.secrets.update(secretName, secret).then((secret) => {
      t.equal(secret.kind, 'Secret', 'returns an object with Secret');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - secrets - update - no secret name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.secrets.update().catch((err) => {
      t.equal(err.message, 'Secret Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - secrets - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.secrets.removeAll, 'function', 'There is a removeAll method on the secrets object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/secrets`)
      .reply(200, {kind: 'SecretList'});

    // Note: https://docs.openshift.org/latest/rest_api/kubernetes_v1.html#delete-collection-of-secret says it return a Status object
    // but it really returns a SecretList object,  possible doc error?
    const removeResult = client.secrets.removeAll().then((secretsList) => {
      t.equal(secretsList.kind, 'SecretList', 'returns an object with SecretList');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - secrets - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.secrets.remove, 'function', 'There is a remove method on the secrets object');

    const clientConfig = privates.get(client).config;
    const secretName = 'cool-deployment-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/secrets/${secretName}`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.secrets.remove(secretName).then((status) => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - secrets - remove - no secret name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.secrets.remove().catch((err) => {
      t.equal(err.message, 'Secret Name is required', 'error message should return');
      t.end();
    });
  });
});
