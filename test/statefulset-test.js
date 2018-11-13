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

test('find - statefulsets - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.statefulsets.findAll, 'function', 'There is a findAll method on the statefulsets object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/apis/apps/v1beta1/namespaces/${clientConfig.context.namespace}/statefulsets`)
      .reply(200, {kind: 'StatefulSetList'});

    const findResult = client.statefulsets.findAll().then((statefulSetList) => {
      t.equal(statefulSetList.kind, 'StatefulSetList', 'returns an object with StatefulSetList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - statefulsets - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.statefulsets.find, 'function', 'There is a find method on the statefulsets object');

    const clientConfig = privates.get(client).config;
    const statefulSetName = 'cool-statefulset-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/apis/apps/v1beta1/namespaces/${clientConfig.context.namespace}/statefulsets/${statefulSetName}`)
      .reply(200, {kind: 'StatefulSet'});

    const findResult = client.statefulsets.find(statefulSetName).then((statefulset) => {
      t.equal(statefulset.kind, 'StatefulSet', 'returns an object with StatefulSet');
      t.end();
    }).catch(e => {
      console.log(e);
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - statefulsets - find - no statefulset name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.statefulsets.find().catch((err) => {
      t.equal(err.message, 'Stateful Set Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - statefulset', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.statefulsets.create, 'function', 'There is a create method on the statefulsets object');

    const clientConfig = privates.get(client).config;
    const statefulset = {
      kind: 'StatefulSet'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/apis/apps/v1beta1/namespaces/${clientConfig.context.namespace}/statefulsets`)
      .reply(200, {kind: 'StatefulSet'});

    const createResult = client.statefulsets.create(statefulset).then((statefulset) => {
      t.equal(statefulset.kind, 'StatefulSet', 'returns an object with StatefulSet');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - statefulset', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.statefulsets.create, 'function', 'There is a create method on the statefulsets object');

    const clientConfig = privates.get(client).config;
    const statefulSet = {
      kind: 'StatefulSet'
    };
    const statefulSetName = 'cool-statefulset-name-1';
    const url = `${client.apis.v1beta1.endpoints().apps}/namespaces/${clientConfig.context.namespace}/statefulsets/${statefulSetName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(url)
      .reply(200, {kind: 'StatefulSet'});

    const createResult = client.statefulsets.update(statefulSetName, statefulSet).then(updated => {
      t.equal(updated.kind, 'StatefulSet', 'returns an object with StatefulSet');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - statefulset with no statefulset name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.statefulsets.update().catch((err) => {
      t.equal(err.message, 'Stateful Set Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - statefulsets - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.statefulsets.removeAll, 'function', 'There is a removeAll method on the statefulsets object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints().apps}/namespaces/${clientConfig.context.namespace}/statefulsets`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(url)
      .reply(200, {kind: 'Status'});

    const removeResult = client.statefulsets.removeAll().then(statefulSetList => {
      t.equal(statefulSetList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - statefulsets - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.statefulsets.remove, 'function', 'There is a remove method on the statefulsets object');

    const clientConfig = privates.get(client).config;
    const statefulSetName = 'cool-statefulset-name-1';
    const url = `${client.apis.v1beta1.endpoints().apps}/namespaces/${clientConfig.context.namespace}/statefulsets/${statefulSetName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(url)
      .reply(200, {kind: 'Status'});

    const removeResult = client.statefulsets.remove(statefulSetName).then(status => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - statefulset - no statefulset name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.statefulsets.remove().catch((err) => {
      t.equal(err.message, 'Stateful Set Name is required', 'error message should return');
      t.end();
    });
  });
});
