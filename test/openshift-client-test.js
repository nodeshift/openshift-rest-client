'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const nock = require('nock');

const userDefinedConfig = require('./test-config.json');

test('openshift rest client', (t) => {
  const openshiftRestClient = require('../');

  t.ok(openshiftRestClient.OpenshiftClient, 'has the OpenshiftClient Object');
  t.ok(openshiftRestClient.config, 'has the config Object');

  t.end();
});

test('openshift client tests', (t) => {
  const openshiftRestClient = require('../lib/openshift-rest-client');

  const osClient = openshiftRestClient();
  t.equal(osClient instanceof Promise, true, 'should return a Promise');

  osClient.then((client) => {
    t.ok(client.apis['build.openshift.io'], 'client object should have a build object');
    t.ok(client.apis.build, 'build object is aliased');

    t.ok(client.apis['apps.openshift.io'], 'client object should have a apps object');
    t.ok(client.apis.app, 'apps object is aliased to app');

    t.ok(client.apis['authorization.openshift.io'], 'client object should have a authorization object');
    t.ok(client.apis.authorization, 'authorization object is aliased to authorization');

    t.ok(client.apis['image.openshift.io'], 'client object should have a image object');
    t.ok(client.apis.image, 'image object is aliased to image');

    t.ok(client.apis['network.openshift.io'], 'client object should have a network object');
    t.ok(client.apis.network, 'network object is aliased to network');

    t.ok(client.apis['oauth.openshift.io'], 'client object should have a oauth object');
    t.ok(client.apis.oauth, 'oauth object is aliased to oauth');

    t.ok(client.apis['project.openshift.io'], 'client object should have a project object');
    t.ok(client.apis.project, 'project object is aliased to project');

    t.ok(client.apis['quota.openshift.io'], 'client object should have a quota object');
    t.ok(client.apis.quota, 'quota object is aliased to quota');

    t.ok(client.apis['route.openshift.io'], 'client object should have a route object');
    t.ok(client.apis.route, 'route object is aliased to route');

    t.ok(client.apis['security.openshift.io'], 'client object should have a security object');
    t.ok(client.apis.security, 'security object is aliased to security');

    t.ok(client.apis['template.openshift.io'], 'client object should have a template object');
    t.ok(client.apis.template, 'template object is aliased to template');

    t.ok(client.apis['user.openshift.io'], 'client object should have a user object');
    t.ok(client.apis.user, 'user object is aliased to user');

    t.ok(client.kubeconfig, 'client should have the kubeconfig object');
    t.end();
  });
});

test('test basic auth - username/password', async (t) => {
  const settings = {
    config: {
      url: 'http://test-url',
      auth: {
        username: 'luke',
        password: 'password'
      }
    }
  };

  const openshiftRestClient = proxyquire('../lib/openshift-rest-client', {
    './basic-auth-request': {
      getTokenFromBasicAuth: (options) => {
        t.equal(options.user, settings.config.auth.username);
        t.equal(options.password, settings.config.auth.password);
        t.equal(options.url, settings.config.url);
        return Promise.resolve('123456789');
      }
    }
  });

  await openshiftRestClient(settings);
  t.pass();
  t.end();
});

test('test basic auth - user/pass', async (t) => {
  const settings = {
    config: {
      url: 'http://test-url',
      auth: {
        user: 'luke',
        pass: 'password'
      },
      insecureSkipTlsVerify: true
    }
  };

  const openshiftRestClient = proxyquire('../lib/openshift-rest-client', {
    './basic-auth-request': {
      getTokenFromBasicAuth: (options) => {
        t.equal(options.user, settings.config.auth.user);
        t.equal(options.password, settings.config.auth.pass);
        t.equal(options.url, settings.config.url);
        t.equal(options.insecureSkipTlsVerify, true);
        return Promise.resolve('123456789');
      }
    }
  });

  await openshiftRestClient(settings);
  t.pass();
  t.end();
});

test('test different config', async (t) => {
  const settings = {
    config: {
      url: 'http://test-url',
      insecureSkipTlsVerify: true
    }
  };

  const openshiftRestClient = proxyquire('../lib/openshift-rest-client', {
    './basic-auth-request': {
      getTokenFromBasicAuth: (options) => {
        t.fail();
        return Promise.reject(new Error('nope'));
      }
    }
  });

  await openshiftRestClient(settings);
  t.pass();
  t.end();
});

test('test different config with auth and no user/username', async (t) => {
  const settings = {
    config: {
      url: 'http://test-url',
      auth: {},
      insecureSkipTlsVerify: true
    }
  };

  const openshiftRestClient = proxyquire('../lib/openshift-rest-client', {
    './basic-auth-request': {
      getTokenFromBasicAuth: (options) => {
        t.fail();
        return Promise.reject(new Error('nope'));
      }
    }
  });

  await openshiftRestClient(settings);
  t.pass();
  t.end();
});

test('test different config - user defined - as KubeConfig', async (t) => {
  const openshiftRestClient = require('../');

  openshiftRestClient.config.loadFromString(JSON.stringify(userDefinedConfig));
  const settings = {
    config: openshiftRestClient.config
  };

  await openshiftRestClient.OpenshiftClient(settings);
  t.pass();
  t.end();
});

test('test different config - different location as a string', async (t) => {
  const openshiftRestClient = require('../');

  const configLocation = `${__dirname}/test-config`;
  const settings = {
    config: configLocation
  };

  const client = await openshiftRestClient.OpenshiftClient(settings);
  const { kubeconfig } = client;
  t.equal(kubeconfig.currentContext, 'for-node-client-testing/192-168-99-100:8443/developer', 'current context is correctly loaded');
  t.end();
});

test('test different config - user defined - as Regular Object', async (t) => {
  const openshiftRestClient = require('../');

  const settings = {
    config: userDefinedConfig
  };

  await openshiftRestClient.OpenshiftClient(settings);
  t.pass();
  t.end();
});

test('test different config - different location as a string', async (t) => {
  const openshiftRestClient = require('../');

  const configLocation = `${__dirname}/test-config`;
  const settings = {
    config: configLocation
  };

  const client = await openshiftRestClient.OpenshiftClient(settings);
  const { kubeconfig } = client;
  t.equal(kubeconfig.currentContext, 'for-node-client-testing/192-168-99-100:8443/developer', 'current context is correctly loaded');
  t.end();
});

test('openshift client tests - loadSpecFromCluster', async (t) => {
  const openshiftRestClient = require('../');

  openshiftRestClient.config.loadFromString(JSON.stringify(userDefinedConfig));
  const settings = {
    loadSpecFromCluster: true,
    config: openshiftRestClient.config
  };

  nock('https://192.168.99.100:8443')
    .matchHeader('authorization', 'Bearer zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U')
    .get('/openapi/v2')
    .reply(201, { paths: {} });

  const osClient = await openshiftRestClient.OpenshiftClient(settings);

  t.pass('client created using the loadSpec function and hitting the /openapi/v2');

  t.ok(osClient.kubeconfig, 'client should have the kubeconfig object');
  t.end();
});

test('openshift client tests - loadSpecFromCluster - Fail to load remote and load default spec', async (t) => {
  const openshiftRestClient = require('../');

  openshiftRestClient.config.loadFromString(JSON.stringify(userDefinedConfig));
  const settings = {
    loadSpecFromCluster: true,
    config: openshiftRestClient.config
  };

  nock('https://192.168.99.100:8443')
    .matchHeader('authorization', 'Bearer zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U')
    .get('/openapi/v2')
    .reply(404, { message: 'Nope' })
    .get('/swagger.json')
    .reply(404, { message: 'Nope' });

  const osClient = await openshiftRestClient.OpenshiftClient(settings);

  t.pass('Failing client load should load default spec');

  t.ok(osClient.apis['build.openshift.io'], 'client object should have a build object');
  t.ok(osClient.apis.build, 'build object is aliased');

  t.ok(osClient.apis['apps.openshift.io'], 'client object should have a apps object');
  t.ok(osClient.apis.app, 'apps object is aliased to app');

  t.ok(osClient.apis['authorization.openshift.io'], 'client object should have a authorization object');
  t.ok(osClient.apis.authorization, 'authorization object is aliased to authorization');

  t.ok(osClient.apis['image.openshift.io'], 'client object should have a image object');
  t.ok(osClient.apis.image, 'image object is aliased to image');

  t.ok(osClient.apis['network.openshift.io'], 'osClient object should have a network object');
  t.ok(osClient.apis.network, 'network object is aliased to network');

  t.ok(osClient.apis['oauth.openshift.io'], 'osClient object should have a oauth object');
  t.ok(osClient.apis.oauth, 'oauth object is aliased to oauth');

  t.ok(osClient.apis['project.openshift.io'], 'osClient object should have a project object');
  t.ok(osClient.apis.project, 'project object is aliased to project');

  t.ok(osClient.apis['quota.openshift.io'], 'osClient object should have a quota object');
  t.ok(osClient.apis.quota, 'quota object is aliased to quota');

  t.ok(osClient.apis['route.openshift.io'], 'osClient object should have a route object');
  t.ok(osClient.apis.route, 'route object is aliased to route');

  t.ok(osClient.apis['security.openshift.io'], 'osClient object should have a security object');
  t.ok(osClient.apis.security, 'security object is aliased to security');

  t.ok(osClient.apis['template.openshift.io'], 'osClient object should have a template object');
  t.ok(osClient.apis.template, 'template object is aliased to template');

  t.ok(osClient.apis['user.openshift.io'], 'osClient object should have a user object');
  t.ok(osClient.apis.user, 'user object is aliased to user');

  t.ok(osClient.kubeconfig, 'client should have the kubeconfig object');
  t.end();
});
