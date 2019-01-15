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

test('find - projects - basic findAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.projects.findAll, 'function', 'There is a findAll method on the projects object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/projects`)
      .reply(200, { kind: 'ProjectList' });

    const findResult = client.projects.findAll().then((projectList) => {
      t.equal(projectList.kind, 'ProjectList', 'returns an object with ProjectList');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - projects - basic find', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.projects.find, 'function', 'There is a find method on the projects object');

    const clientConfig = privates.get(client).config;
    const projectName = 'cool-project-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .get(`/oapi/v1/projects/${projectName}`)
      .reply(200, { kind: 'Project' });

    const findResult = client.projects.find(projectName).then((project) => {
      t.equal(project.kind, 'Project', 'returns an object with Project');
      t.end();
    });

    t.equal(findResult instanceof Promise, true, 'should return a Promise');
  });
});

test('find - projects - find - no project name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.projects.find().catch((err) => {
      t.equal(err.message, 'Project Name is required', 'error message should return');
      t.end();
    });
  });
});

test('create - project', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.projects.create, 'function', 'There is a create method on the projects object');

    const clientConfig = privates.get(client).config;
    const project = {
      kind: 'Project'
    };

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .post(`/oapi/v1/projects`)
      .reply(200, { kind: 'Project' });

    const createResult = client.projects.create(project).then((project) => {
      t.equal(project.kind, 'Project', 'returns an object with Project');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - project', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.projects.create, 'function', 'There is a create method on the projects object');

    const clientConfig = privates.get(client).config;
    const project = {
      kind: 'Project'
    };
    const projectName = 'cool-project-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .put(`/oapi/v1/projects/${projectName}`)
      .reply(200, { kind: 'Project' });

    const createResult = client.projects.update(projectName, project).then((project) => {
      t.equal(project.kind, 'Project', 'returns an object with Project');
      t.end();
    });

    t.equal(createResult instanceof Promise, true, 'should return a Promise');
  });
});

test('update - projects - update - no project name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.projects.update().catch((err) => {
      t.equal(err.message, 'Project Name is required', 'error message should return');
      t.end();
    });
  });
});

test('remove - projects - basic removeAll', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.projects.removeAll, 'function', 'There is a removeAll method on the projects object');

    const clientConfig = privates.get(client).config;

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/projects`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.projects.removeAll().then((projectList) => {
      t.equal(projectList.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - projects - basic remove', (t) => {
  openshiftRestClient(settings).then((client) => {
    t.equal(typeof client.projects.remove, 'function', 'There is a remove method on the projects object');

    const clientConfig = privates.get(client).config;
    const projectName = 'cool-project-name-1';

    nock(clientConfig.cluster)
      .matchHeader('authorization', `Bearer ${clientConfig.user.token}`) // taken from the config
      .delete(`/oapi/v1/projects/${projectName}`)
      .reply(200, { kind: 'Status' });

    const removeResult = client.projects.remove(projectName).then((status) => {
      t.equal(status.kind, 'Status', 'returns an object with Status');
      t.end();
    });

    t.equal(removeResult instanceof Promise, true, 'should return a Promise');
  });
});

test('remove - projects - remove - no project name', (t) => {
  openshiftRestClient(settings).then((client) => {
    client.projects.remove().catch((err) => {
      t.equal(err.message, 'Project Name is required', 'error message should return');
      t.end();
    });
  });
});
