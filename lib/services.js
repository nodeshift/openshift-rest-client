'use strict';

const privates = require('./private-map');
const request = require('./common-request');

// Finds an image stream based on a namespace and build(?) name
function find (client) {
  return function find (serviceName) {
    const clientConfig = privates.get(client).config;

    // Using api here instead of oapi
    const req = {
      method: 'GET',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/services/${serviceName}`
    };

    return request(client, req);
  };
}

function create (client) {
  return function create (serviceConfig, options) {
    options = options || {};

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'POST',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/services`,
      json: false,
      body: JSON.stringify(serviceConfig)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

module.exports = {
  find: find,
  create: create
};
