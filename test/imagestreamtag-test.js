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

test('find - imagestreamtags - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreamtags.findAll, 'function', 'There is a findAll method on the imagestreamtags object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreamtags`)
      .reply(200, {kind: 'ImageStreamTagList'});

    const findResult = client.imagestreamtags.findAll().then((imageStreamTagList) => {
      t.equal(imageStreamTagList.kind, 'ImageStreamTagList', 'returns an object with ImageStreamTagList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - imagestreamtags - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreamtags.find, 'function', 'There is a find method on the imagestreamtags object');

    const clientConfig = privates.get(client).config;
    const imageStreamTagName = 'cool-imagestreamtag-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreamtags/${imageStreamTagName}`)
      .reply(200, {kind: 'ImageStreamTag'});

    const findResult = client.imagestreamtags.find(imageStreamTagName).then((imagestreamtag) => {
      t.equal(imagestreamtag.kind, 'ImageStreamTag', 'returns an object with ImageStreamTag');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - imagestreamtags - find - no imagestreamtag name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.imagestreamtags.find().catch((err) => {
      t.equal(err.message, 'Image Stream Tag Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - imagestreamtag', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreamtags.create, 'function', 'There is a create method on the imagestreamtags object');

    const clientConfig = privates.get(client).config;
    const imagestreamtag = {
      kind: 'ImageStreamTag'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreamtags`)
      .reply(200, {kind: 'ImageStreamTag'});

    const createResult = client.imagestreamtags.create(imagestreamtag).then((imagestreamtag) => {
      t.equal(imagestreamtag.kind, 'ImageStreamTag', 'returns an object with ImageStreamTag');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - imagestreamtag', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreamtags.create, 'function', 'There is a create method on the imagestreamtags object');

    const clientConfig = privates.get(client).config;
    const imagestreamtag = {
      kind: 'ImageStreamTag'
    };
    const imageStreamTagName = 'cool-imagestreamtag-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreamtags/${imageStreamTagName}`)
      .reply(200, {kind: 'ImageStreamTag'});

    const createResult = client.imagestreamtags.update(imageStreamTagName, imagestreamtag).then((imagestreamtag) => {
      t.equal(imagestreamtag.kind, 'ImageStreamTag', 'returns an object with ImageStreamTag');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - imagestreamtags - update - no imagestreamtag name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.imagestreamtags.update().catch((err) => {
      t.equal(err.message, 'Image Stream Tag Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - imagestreamtags - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreamtags.removeAll, 'function', 'There is a removeAll method on the imagestreamtags object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreamtags`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.imagestreamtags.removeAll().then((imageStreamTagList) => {
      t.equal(imageStreamTagList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - imagestreamtags - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.imagestreamtags.remove, 'function', 'There is a remove method on the imagestreamtags object');

    const clientConfig = privates.get(client).config;
    const imageStreamTagName = 'cool-imagestreamtag-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreamtags/${imageStreamTagName}`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.imagestreamtags.remove(imageStreamTagName).then((status) => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - imagestreamtags - remove - no imagestreamtag name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.imagestreamtags.remove().catch((err) => {
      t.equal(err.message, 'Image Stream Tag Name is required', 'error message should return');
      t.end();
    });
  });
});
