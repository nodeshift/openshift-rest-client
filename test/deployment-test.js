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

test('find - deployments - basic findAll', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.deployments.findAll, 'function', 'There is a findAll method on the deployments object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints().apps}/namespaces/${clientConfig.context.namespace}/deployments`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(url).reply(200, { kind: 'DeploymentList' });

    const findResult = client.deployments.findAll().then(deploymentList => {
      t.equal(deploymentList.kind, 'DeploymentList', 'returns an object with DeploymentList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - deployments - basic find', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.deployments.find, 'function', 'There is a find method on the deployments object');

    const clientConfig = privates.get(client).config;
    const deploymentName = 'cool-deploymentconfig-name-1';
    const url = `${client.apis.v1beta1.endpoints().apps}/namespaces/${clientConfig.context.namespace}/deployments/${deploymentName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(url)
      .reply(200, { kind: 'Deployment' });

    const findResult = client.deployments.find(deploymentName).then(deployment => {
      t.equal(deployment.kind, 'Deployment', 'returns an object with DeploymentConfig');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - deployments - find with no deployment name', (t) => {
  openshiftRestClient(settings).then(client => {
    client.deployments.find().catch(err => {
      t.equal(err.message, 'Deployment Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - deployment', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.deploymentconfigs.create, 'function', 'There is a create method on the deploymentconfigs object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints().apps}/namespaces/${clientConfig.context.namespace}/deployments`;
    const deployment = {
      kind: 'Deployment'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(url)
      .reply(200, { kind: 'Deployment' });

    const createResult = client.deployments.create(deployment).then(deployment => {
      t.equal(deployment.kind, 'Deployment', 'returns an object with Deployment');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - deployment', (t) => {
  openshiftRestClient(settings).then(client => {
    t.equal(typeof client.deployments.create, 'function', 'There is a create method on the deployments object');

    const clientConfig = privates.get(client).config;
    const deployment = {
      kind: 'Deployment'
    };
    const deploymentName = 'cool-deploymentconfig-name-1';
    const url = `${client.apis.v1beta1.endpoints().apps}/namespaces/${clientConfig.context.namespace}/deployments/${deploymentName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(url)
      .reply(200, { kind: 'Deployment' });

    const createResult = client.deployments.update(deploymentName, deployment).then(updated => {
      t.equal(updated.kind, 'Deployment', 'returns an object with Deployment');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - deployment with no deployment name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.deployments.update().catch((err) => {
      t.equal(err.message, 'Deployment Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - deployments - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.deployments.removeAll, 'function', 'There is a removeAll method on the deployments object');

    const clientConfig = privates.get(client).config;
    const url = `${client.apis.v1beta1.endpoints().apps}/namespaces/${clientConfig.context.namespace}/deployments`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(url)
      .reply(200, { kind: 'Status' });

    const removeResult = client.deployments.removeAll().then(deploymentList => {
      t.equal(deploymentList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - deployments - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.deployments.remove, 'function', 'There is a remove method on the deployments object');

    const clientConfig = privates.get(client).config;
    const deploymentName = 'cool-deploymentconfig-name-1';
    const url = `${client.apis.v1beta1.endpoints().apps}/namespaces/${clientConfig.context.namespace}/deployments/${deploymentName}`;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(url)
      .reply(200, { kind: 'Status' });

    const removeResult = client.deployments.remove(deploymentName).then(status => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - deployment - no deployment name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.deployments.remove().catch((err) => {
      t.equal(err.message, 'Deployment Name is required', 'error message should return');
      t.end();
    });
  });
});
