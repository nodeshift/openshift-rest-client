'use strict';

const openshiftRestClient = require('../');

const test = require('tape');
const nock = require('nock');

const privates = require('../lib/private-map');

test('testing project endpoint', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftRestClient(settings).then((client) => {
    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get('/oapi/v1/projects')
      .reply(200, {mocked: 'mocked'});

    client.projects.find().then((projects) => {
      t.pass('return successful');
      t.end();
    });
  });
});
