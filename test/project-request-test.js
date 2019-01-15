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

test('find - projectrequests - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.projectrequests.findAll, 'function', 'There is a findAll method on the projectrequests object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/projectrequests`)
      .reply(200, { kind: 'ProjectRequestList' });

    const findResult = client.projectrequests.findAll().then((projectRequestList) => {
      t.equal(projectRequestList.kind, 'ProjectRequestList', 'returns an object with ProjectRequestList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('create - projectrequest', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.projectrequests.create, 'function', 'There is a create method on the projectrequests object');

    const clientConfig = privates.get(client).config;
    const projectrequest = {
      kind: 'ProjectRequest'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/oapi/v1/projectrequests`)
      .reply(200, { kind: 'ProjectRequest' });

    const createResult = client.projectrequests.create(projectrequest).then((projectrequest) => {
      t.equal(projectrequest.kind, 'ProjectRequest', 'returns an object with ProjectRequest');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});
