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

test('find - events - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.events.findAll, 'function', 'There is a findAll method on the events object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/events`)
      .reply(200, {kind: 'List'});

    const findResult = client.events.findAll().then((evtList) => {
      t.equal(evtList.kind, 'List', 'returns an object with List');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - events - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.events.find, 'function', 'There is a find method on the events object');

    const clientConfig = privates.get(client).config;
    const evtName = 'cool-evt-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/api/v1/namespaces/${clientConfig.context.namespace}/events/${evtName}`)
      .reply(200, {kind: 'Event'});

    const findResult = client.events.find(evtName).then((evt) => {
      t.equal(evt.kind, 'Event', 'returns an object with Event');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - persistent volume claims - find - no claim name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.events.find().catch((err) => {
      t.equal(err.message, 'Event Name is required', 'error message should return');
      t.end();
    });
  });
});
