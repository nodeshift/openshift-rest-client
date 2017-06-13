'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - build', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.builds.find, 'function', 'There is a find method on the build object');

      const clientConfig = privates.get(client).config;
      const buildName = 'nodejs-rest-http-s2i';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/builds/${buildName}`)
        .reply(200, {kind: 'Build'});

      const findResult = client.builds.find(buildName).then((build) => {
        t.equal(build.kind, 'Build', 'returns an object with Build');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});
