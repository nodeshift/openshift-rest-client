'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - imagestreams', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.imagestreams.find, 'function', 'There is a find method on the imagestreams object');

      const clientConfig = privates.get(client).config;
      const imagestreamsName = 'nodejs-rest-http';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreams/${imagestreamsName}`)
        .reply(200, {kind: 'Imagestream'});

      const findResult = client.imagestreams.find(imagestreamsName).then((imagestream) => {
        t.equal(imagestream.kind, 'Imagestream', 'returns an object with Imagestream');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('create - imagestreams', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.imagestreams.create, 'function', 'There is a create method on the imagestreams object');

      const clientConfig = privates.get(client).config;
      const imagestream = {
        kind: 'ImageStream'
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .post(`/oapi/v1/namespaces/${clientConfig.context.namespace}/imagestreams`)
        .reply(200, {kind: 'ImageStream'});

      const createResult = client.imagestreams.create(imagestream).then((imagestream) => {
        t.equal(imagestream.kind, 'ImageStream', 'returns an object with ImageStream');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});
