'use strict';

const test = require('tape');
const nock = require('nock');
const fs = require('fs');

const openshiftRestClient = require('../');
const userDefinedConfig = require('./test-config.json');

// There was an issue with some underlying dependecies that made this api break
// but not any others.
test('instantiateBinary - buildconfig', async (t) => {
  openshiftRestClient.config.loadFromString(JSON.stringify(userDefinedConfig));
  const settings = {
    config: openshiftRestClient.config,
    loadSpecFromCluster: false
  };

  const client = await openshiftRestClient.OpenshiftClient(settings);
  const buildConfigName = 'cool-buildconfig-name-1';
  const namespace = 'for-node-client-testing';

  nock('https://192.168.99.100:8443')
    .matchHeader('authorization', 'Bearer zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U')
    .post(`/apis/build.openshift.io/v1/namespaces/for-node-client-testing/buildconfigs/${buildConfigName}/instantiatebinary`)
    .reply(201, { kind: 'BinaryBuildRequest' });

  const binaryResponse = await client.apis.build.v1.ns(namespace).buildconfigs(buildConfigName).instantiatebinary.post({ body: fs.createReadStream(`${__dirname}/test-config`), json: false });
  const response = JSON.parse(binaryResponse.body);

  t.equal(response.kind, 'BinaryBuildRequest', 'returns an object with BinaryBuildRequest');
  t.end();
});
