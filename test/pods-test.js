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

test('find - pods - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.pods.findAll, 'function', 'There is a findAll method on the pods object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/pods`)
      .reply(200, { kind: 'PodList' });

    const findResult = client.pods.findAll().then((podsList) => {
      t.equal(podsList.kind, 'PodList', 'returns an object with PodList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - pods - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.pods.find, 'function', 'There is a find method on the pods object');

    const clientConfig = privates.get(client).config;
    const podName = 'cool-pod-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/pods/${podName}`)
      .reply(200, { kind: 'Pod' });

    const findResult = client.pods.find(podName).then((pod) => {
      t.equal(pod.kind, 'Pod', 'returns an object with Pod');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - pods - find - no pod name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.pods.find().catch((err) => {
      t.equal(err.message, 'Pod Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - pod', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.pods.create, 'function', 'There is a create method on the pods object');

    const clientConfig = privates.get(client).config;
    const pod = {
      kind: 'Pod'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/api/v1/namespaces/${clientConfig.context.namespace}/pods`)
      .reply(200, { kind: 'Pod' });

    const createResult = client.pods.create(pod).then((pod) => {
      t.equal(pod.kind, 'Pod', 'returns an object with Pod');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - pod', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.pods.create, 'function', 'There is a create method on the pods object');

    const clientConfig = privates.get(client).config;
    const pod = {
      kind: 'Pod'
    };
    const podName = 'cool-pod-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(`/api/v1/namespaces/${clientConfig.context.namespace}/pods/${podName}`)
      .reply(200, { kind: 'Pod' });

    const createResult = client.pods.update(podName, pod).then((pod) => {
      t.equal(pod.kind, 'Pod', 'returns an object with Pod');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - pods - update - no pod name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.pods.update().catch((err) => {
      t.equal(err.message, 'Pod Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - pods - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.pods.removeAll, 'function', 'There is a removeAll method on the pods object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/pods`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.pods.removeAll().then((podsList) => {
      t.equal(podsList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - pods - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.pods.remove, 'function', 'There is a remove method on the pods object');

    const clientConfig = privates.get(client).config;
    const podName = 'cool-pod-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/api/v1/namespaces/${clientConfig.context.namespace}/pods/${podName}`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.pods.remove(podName).then((status) => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - pods - remove - no pod name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.pods.remove().catch((err) => {
      t.equal(err.message, 'Pod Name is required', 'error message should return');
      t.end();
    });
  });
});
