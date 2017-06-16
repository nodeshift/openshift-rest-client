'use strict';

const privates = require('./private-map');
const request = require('./common-request');

// Finds an image stream based on a namespace and build(?) name
function find (client) {
  return function find (deploymentConfigName) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/deploymentconfigs/${deploymentConfigName}`
    };

    return request(client, req);
  };
}

function create (client) {
  return function create (deploymentConfig, options) {
    options = options || {};
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'POST',
      json: false,
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/deploymentconfigs`,
      body: JSON.stringify(deploymentConfig)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

function remove (client) {
  return function remove (deploymentConfigName, options) {
    options = options || {};

    if (!deploymentConfigName) {
      return Promise.reject(new Error('Deployment Config Name is required'));
    }

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'DELETE',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/deploymentconfigs/${deploymentConfigName}`,
      qs: options.qs,
      body: options.body
    };

    return request(client, req);
  };
}

module.exports = {
  find: find,
  create: create,
  remove: remove
};
