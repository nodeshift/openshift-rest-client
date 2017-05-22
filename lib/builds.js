'use strict';

const request = require('./common-request');

const privates = require('./private-map');

// Finds a buildconfig on a namespace and build(?) name
function find (client) {
  return function find (buildName) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/builds/${buildName}`
    };

    return request(client, req);
  };
}

module.exports = {
  find: find
};
