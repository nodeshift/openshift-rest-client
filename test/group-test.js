'use strict';

const test = require('tape');
const nock = require('nock');

const openshiftRestClient = require('../');
const openshiftConfigLoader = require('openshift-config-loader');
const privates = require('../lib/private-map');

test('find - groups - basic findAll', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.groups.findAll, 'function', 'There is a findAll method on the groups object');

      const clientConfig = privates.get(client).config;

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/groups`)
        .reply(200, {kind: 'GroupList'});

      const findResult = client.groups.findAll().then((groupList) => {
        t.equal(groupList.kind, 'GroupList', 'returns an object with GroupList');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - groups - basic find', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.groups.find, 'function', 'There is a find method on the groups object');

      const clientConfig = privates.get(client).config;
      const groupName = 'cool-group-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .get(`/oapi/v1/groups/${groupName}`)
        .reply(200, {kind: 'Group'});

      const findResult = client.groups.find(groupName).then((group) => {
        t.equal(group.kind, 'Group', 'returns an object with Group');
        t.end();
      });

      t.equal(findResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('find - groups - find - no group name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.groups.find().catch((err) => {
        t.equal(err.message, 'Group Name is required', 'error message should return');
        t.end();
      });
    });
  });
});

test('create - group', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.groups.create, 'function', 'There is a create method on the groups object');

      const clientConfig = privates.get(client).config;
      const group = {
        kind: 'Group'
      };

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .post(`/oapi/v1/groups`)
        .reply(200, {kind: 'Group'});

      const createResult = client.groups.create(group).then((group) => {
        t.equal(group.kind, 'Group', 'returns an object with Group');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('update - group', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.groups.create, 'function', 'There is a create method on the groups object');

      const clientConfig = privates.get(client).config;
      const group = {
        kind: 'Group'
      };
      const groupName = 'cool-group-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .put(`/oapi/v1/groups/${groupName}`)
        .reply(200, {kind: 'Group'});

      const createResult = client.groups.update(groupName, group).then((group) => {
        t.equal(group.kind, 'Group', 'returns an object with Group');
        t.end();
      });

      t.equal(createResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('update - groups - update - no group name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.groups.update().catch((
        err) => {
        t.equal(err.message, 'Group Name is required', 'error message should return');
        t.end();
      });
    });
  });
});

test('remove - groups - basic removeAll', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.groups.removeAll, 'function', 'There is a removeAll method on the groups object');

      const clientConfig = privates.get(client).config;

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .delete(`/oapi/v1/groups`)
        .reply(200, {kind: 'Status'});

      const removeResult = client.groups.removeAll().then((groupList) => {
        t.equal(groupList.kind, 'Status', 'returns an object with Status');
        t.end();
      });

      t.equal(removeResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - groups - basic remove', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      t.equal(typeof client.groups.remove, 'function', 'There is a remove method on the groups object');

      const clientConfig = privates.get(client).config;
      const groupName = 'cool-group-name-1';

      nock(clientConfig.cluster)
        .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
        .delete(`/oapi/v1/groups/${groupName}`)
        .reply(200, {kind: 'Status'});

      const removeResult = client.groups.remove(groupName).then((status) => {
        t.equal(status.kind, 'Status', 'returns an object with Status');
        t.end();
      });

      t.equal(removeResult instanceof Promise, true, 'should return a Promise');
    });
  });
});

test('remove - groups - remove - no group name', (t) => {
  const settings = {
    configLocation: `${__dirname}/test-config`
  };

  openshiftConfigLoader(settings).then((config) => {
    openshiftRestClient(config).then((client) => {
      client.groups.remove().catch((err) => {
        t.equal(err.message, 'Group Name is required', 'error message should return');
        t.end();
      });
    });
  });
});
