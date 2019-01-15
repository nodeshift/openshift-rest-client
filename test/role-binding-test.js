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

test('find - rolebindings - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.rolebindings.findAll, 'function', 'There is a findAll method on the rolebindings object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/rolebindings`)
      .reply(200, { kind: 'RoleBindingList' });

    const findResult = client.rolebindings.findAll().then((roleBindingList) => {
      t.equal(roleBindingList.kind, 'RoleBindingList', 'returns an object with RoleBindingList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - rolebindings - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.rolebindings.find, 'function', 'There is a find method on the rolebindings object');

    const clientConfig = privates.get(client).config;
    const roleBindingName = 'cool-rolebinding-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/rolebindings/${roleBindingName}`)
      .reply(200, { kind: 'RoleBinding' });

    const findResult = client.rolebindings.find(roleBindingName).then((rolebinding) => {
      t.equal(rolebinding.kind, 'RoleBinding', 'returns an object with RoleBinding');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - rolebindings - find - no rolebinding name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.rolebindings.find().catch((err) => {
      t.equal(err.message, 'Role Binding Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - rolebinding', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.rolebindings.create, 'function', 'There is a create method on the rolebindings object');

    const clientConfig = privates.get(client).config;
    const rolebinding = {
      kind: 'RoleBinding'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/rolebindings`)
      .reply(200, { kind: 'RoleBinding' });

    const createResult = client.rolebindings.create(rolebinding).then((rolebinding) => {
      t.equal(rolebinding.kind, 'RoleBinding', 'returns an object with RoleBinding');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - rolebinding', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.rolebindings.create, 'function', 'There is a create method on the rolebindings object');

    const clientConfig = privates.get(client).config;
    const rolebinding = {
      kind: 'RoleBinding'
    };
    const roleBindingName = 'cool-rolebinding-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(`/oapi/v1/namespaces/${clientConfig.context.namespace}/rolebindings/${roleBindingName}`)
      .reply(200, { kind: 'RoleBinding' });

    const createResult = client.rolebindings.update(roleBindingName, rolebinding).then((rolebinding) => {
      t.equal(rolebinding.kind, 'RoleBinding', 'returns an object with RoleBinding');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - rolebindings - update - no rolebinding name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.rolebindings.update().catch((err) => {
      t.equal(err.message, 'Role Binding Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - rolebindings - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.rolebindings.removeAll, 'function', 'There is a removeAll method on the rolebindings object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/rolebindings`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.rolebindings.removeAll().then((roleBindingList) => {
      t.equal(roleBindingList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - rolebindings - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.rolebindings.remove, 'function', 'There is a remove method on the rolebindings object');

    const clientConfig = privates.get(client).config;
    const roleBindingName = 'cool-rolebinding-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/rolebindings/${roleBindingName}`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.rolebindings.remove(roleBindingName).then((status) => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - rolebindings - remove - no rolebinding name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.rolebindings.remove().catch((err) => {
      t.equal(err.message, 'Role Binding Name is required', 'error message should return');
      t.end();
    });
  });
});
