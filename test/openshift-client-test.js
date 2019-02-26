'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');

test('openshift rest client', (t) => {
  const openshiftRestClient = require('../');

  t.ok(openshiftRestClient.OpenshiftClient, 'has the OpenshiftClient Object');
  t.ok(openshiftRestClient.config, 'has the config Object');

  t.end();
});

test('openshift client tests', (t) => {
  // Need to stub the config loader for these tests
  const stubbedConfig = (client) => {
    return Promise.resolve(client);
  };

  const openshiftRestClient = proxyquire('../lib/openshift-rest-client', {
    'kubernetes-client': {
      config: {
        fromKubeconfig: stubbedConfig
      }
    }
  });

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

    t.end();
  });
});
