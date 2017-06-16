'use strict';

const privates = require('./private-map');
const request = require('./common-request');

// Finds an image stream based on a namespace and build(?) name
function find (client) {
  return function find (routeName) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes/${routeName}`
    };

    return request(client, req);
  };
}

function create (client) {
  return function create (routeConfig, options) {
    options = options || {};

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'POST',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes`,
      json: false,
      body: JSON.stringify(routeConfig)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

function remove (client) {
  return function remove (routeName, options) {
    options = options || {};

    if (!routeName) {
      return Promise.reject(new Error('Route Name is required'));
    }

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'DELETE',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes/${routeName}`,
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
