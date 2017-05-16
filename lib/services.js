'use strict';

const privates = require('./private-map');
const request = require('request');

// Finds an image stream based on a namespace and build(?) name
function find (client) {
  return function find (serviceName) {
    return new Promise((resolve, reject) => {
      const clientConfig = privates.get(client).config;

      const req = {
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        json: true
      };

      // Using api here instead of oapi
      req.url = `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/services/${serviceName}`;

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
  return function create (serviceConfig, options) {
    return new Promise((resolve, reject) => {
      options = options || {};

      const clientConfig = privates.get(client).config;

      const req = {
        method: 'POST',
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        body: JSON.stringify(serviceConfig)
      };

      req.url = `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/services`;

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
