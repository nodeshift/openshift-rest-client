'use strict';

const privates = require('./private-map');
const request = require('request');

// Finds an image stream based on a namespace and build(?) name
function find (client) {
  return function find (routeName) {
    return new Promise((resolve, reject) => {
      const clientConfig = privates.get(client).config;

      const req = {
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        json: true
      };

      req.url = `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes/${routeName}`;

      request(req, (err, response, body) => {
        if (err) {
          return reject(err);
        }

        return resolve(body);
      });
    });
  };
}

function create (client) {
  return function create (routeConfig, options) {
    return new Promise((resolve, reject) => {
      options = options || {};

      const clientConfig = privates.get(client).config;

      const req = {
        method: 'POST',
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        body: JSON.stringify(routeConfig)
      };

      req.url = `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes`;

      request(req, (err, response, body) => {
        if (err) {
          return reject(err);
        }

        return resolve(JSON.parse(body));
      });
    });
  };
}

module.exports = {
  find: find,
  create: create
};
