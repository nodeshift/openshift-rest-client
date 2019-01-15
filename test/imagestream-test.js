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

test('find - imagestreams - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreams.findAll, 'function', 'There is a findAll method on the imagestreams object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreams`)
      .reply(200, { kind: 'ImageStreamList' });

    const findResult = client.imagestreams.findAll().then((imageStreamList) => {
      t.equal(imageStreamList.kind, 'ImageStreamList', 'returns an object with ImageStreamList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - imagestreams - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreams.find, 'function', 'There is a find method on the imagestreams object');

    const clientConfig = privates.get(client).config;
    const imageStreamName = 'cool-imagestream-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreams/${imageStreamName}`)
      .reply(200, { kind: 'ImageStream' });

    const findResult = client.imagestreams.find(imageStreamName).then((imagestream) => {
      t.equal(imagestream.kind, 'ImageStream', 'returns an object with ImageStream');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - imagestreams - find - no imagestream name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.imagestreams.find().catch((err) => {
      t.equal(err.message, 'Image Stream Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - imagestream', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreams.create, 'function', 'There is a create method on the imagestreams object');

    const clientConfig = privates.get(client).config;
    const imagestream = {
      kind: 'ImageStream'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreams`)
      .reply(200, { kind: 'ImageStream' });

    const createResult = client.imagestreams.create(imagestream).then((imagestream) => {
      t.equal(imagestream.kind, 'ImageStream', 'returns an object with ImageStream');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - imagestream', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreams.create, 'function', 'There is a create method on the imagestreams object');

    const clientConfig = privates.get(client).config;
    const imagestream = {
      kind: 'ImageStream'
    };
    const imageStreamName = 'cool-imagestream-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreams/${imageStreamName}`)
      .reply(200, { kind: 'ImageStream' });

    const createResult = client.imagestreams.update(imageStreamName, imagestream).then((imagestream) => {
      t.equal(imagestream.kind, 'ImageStream', 'returns an object with ImageStream');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - imagestreams - update - no imagestream name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.imagestreams.update().catch((err) => {
      t.equal(err.message, 'Image Stream Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - imagestreams - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreams.removeAll, 'function', 'There is a removeAll method on the imagestreams object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreams`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.imagestreams.removeAll().then((imageStreamList) => {
      t.equal(imageStreamList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - imagestreams - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreams.remove, 'function', 'There is a remove method on the imagestreams object');

    const clientConfig = privates.get(client).config;
    const imageStreamName = 'cool-imagestream-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreams/${imageStreamName}`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.imagestreams.remove(imageStreamName).then((status) => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - imagestreams - remove - no imagestream name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.imagestreams.remove().catch((err) => {
      t.equal(err.message, 'Image Stream Name is required', 'error message should return');
      t.end();
    });
  });
});
