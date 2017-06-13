'use strict';

const request = require('./common-request');
const privates = require('./private-map');

// find a list of replication controllers
function findAll (client) {
  return function findAll (options) {
    options = options || {};
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/replicationcontrollers`,
      qs: options.qs
    };

    return request(client, req);
  };
}

// find just 1 replication controller
// This could probably combined into 1 method with the above finfAll
function find (client) {
  return function find (replicationControllerName, options) {
    options = options || {};
    if (!replicationControllerName) {
      return Promise.reject(new Error('Replication Controller Name is required'));
    }
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/replicationcontrollers/${replicationControllerName}`
    };

    return request(client, req);
  };
}

function remove (client) {
  return function remove (replicationControllerName, options) {
    options = options || {};

    if (!replicationControllerName) {
      return Promise.reject(new Error('Replication Controller Name is required'));
    }

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'DELETE',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/replicationcontrollers/${replicationControllerName}`,
      body: options.body
    };

    return request(client, req);
  };
}

function removeAll (client) {
  return function removeAll (options) {
    options = options || {};

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'DELETE',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/replicationcontrollers`,
      qs: options.qs
    };

    return request(client, req);
  };
}

module.exports = {
  findAll: findAll,
  find: find,
  remove: remove,
  removeAll: removeAll
};
