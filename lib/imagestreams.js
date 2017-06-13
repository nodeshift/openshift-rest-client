'use strict';

const privates = require('./private-map');
const request = require('./common-request');

// Finds an image stream based on a namespace and build(?) name
function find (client) {
  return function find (imageStreamName) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/imagestreams/${imageStreamName}`
    };

    return request(client, req);
  };
}

function create (client) {
  return function create (imageStreamConfig, options) {
    options = options || {};
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'POST',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/imagestreams`,
      body: JSON.stringify(imageStreamConfig),
      json: false
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
