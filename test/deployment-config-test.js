'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - deployment-config', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.deploymentconfigs.find, 'function', 'There is a find method on the deploymentconfigs object');

      const clientConfig = privates.get(client).config;
      const deploymentconfigName = 'nodejs-rest-http';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/deploymentconfigs/${deploymentconfigName}`)
        .reply(200, {kind: 'DeploymentConfig'});

      const findResult = client.deploymentconfigs.find(deploymentconfigName).then((deploymentconfig) => {
        t.equal(deploymentconfig.kind, 'DeploymentConfig', 'returns an object with DeploymentConfig');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('create - deployment-config', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.deploymentconfigs.find, 'function', 'There is a find method on the deploymentconfigs object');

      const clientConfig = privates.get(client).config;
      const deploymentConfig = {
        kind: 'DeploymentConfig'
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/deploymentconfigs`)
        .reply(200, {kind: 'DeploymentConfig'});

      const createResult = client.deploymentconfigs.create(deploymentConfig).then((deploymentconfig) => {
        t.equal(deploymentconfig.kind, 'DeploymentConfig', 'returns an object with DeploymentConfig');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});
