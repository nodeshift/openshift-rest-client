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

test('find - deploymentconfigs - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.deploymentconfigs.findAll, 'function', 'There is a findAll method on the deploymentconfigs object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/deploymentconfigs`)
      .reply(200, {kind: 'DeploymentConfigList'});

    const findResult = client.deploymentconfigs.findAll().then((deploymentConfigList) => {
      t.equal(deploymentConfigList.kind, 'DeploymentConfigList', 'returns an object with DeploymentConfigList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - deploymentconfigs - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.deploymentconfigs.find, 'function', 'There is a find method on the deploymentconfigs object');

    const clientConfig = privates.get(client).config;
    const deploymentConfigName = 'cool-deploymentconfig-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/deploymentconfigs/${deploymentConfigName}`)
      .reply(200, {kind: 'DeploymentConfig'});

    const findResult = client.deploymentconfigs.find(deploymentConfigName).then((deploymentconfig) => {
      t.equal(deploymentconfig.kind, 'DeploymentConfig', 'returns an object with DeploymentConfig');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - deploymentconfigs - find - no deploymentconfig name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.deploymentconfigs.find().catch((err) => {
      t.equal(err.message, 'Deployment Config Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - deploymentconfig', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.deploymentconfigs.create, 'function', 'There is a create method on the deploymentconfigs object');

    const clientConfig = privates.get(client).config;
    const deploymentconfig = {
      kind: 'DeploymentConfig'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/deploymentconfigs`)
      .reply(200, {kind: 'DeploymentConfig'});

    const createResult = client.deploymentconfigs.create(deploymentconfig).then((deploymentconfig) => {
      t.equal(deploymentconfig.kind, 'DeploymentConfig', 'returns an object with DeploymentConfig');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - deploymentconfig', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.deploymentconfigs.create, 'function', 'There is a create method on the deploymentconfigs object');

    const clientConfig = privates.get(client).config;
    const deploymentconfig = {
      kind: 'DeploymentConfig'
    };
    const deploymentConfigName = 'cool-deploymentconfig-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(`/oapi/v1/namespaces/${clientConfig.context.namespace}/deploymentconfigs/${deploymentConfigName}`)
      .reply(200, {kind: 'DeploymentConfig'});

    const createResult = client.deploymentconfigs.update(deploymentConfigName, deploymentconfig).then((deploymentconfig) => {
      t.equal(deploymentconfig.kind, 'DeploymentConfig', 'returns an object with DeploymentConfig');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - deploymentconfigs - update - no deploymentconfig name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.deploymentconfigs.update().catch((err) => {
      t.equal(err.message, 'Deployment Config Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - deploymentconfigs - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.deploymentconfigs.removeAll, 'function', 'There is a removeAll method on the deploymentconfigs object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/deploymentconfigs`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.deploymentconfigs.removeAll().then((deploymentConfigList) => {
      t.equal(deploymentConfigList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - deploymentconfigs - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.deploymentconfigs.remove, 'function', 'There is a remove method on the deploymentconfigs object');

    const clientConfig = privates.get(client).config;
    const deploymentConfigName = 'cool-deploymentconfig-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/namespaces/${clientConfig.context.namespace}/deploymentconfigs/${deploymentConfigName}`)
      .reply(200, {kind: 'Status'});

    const removeResult = client.deploymentconfigs.remove(deploymentConfigName).then((status) => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - deploymentconfigs - remove - no deploymentconfig name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.deploymentconfigs.remove().catch((err) => {
      t.equal(err.message, 'Deployment Config Name is required', 'error message should return');
      t.end();
    });
  });
});
