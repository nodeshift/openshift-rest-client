'use strict';

const privates = require('./private-map');
const request = require('request');

// Finds an image stream based on a namespace and build(?) name
function find (client) {
  return function find (deploymentConfigName) {
    return new Promise((resolve, reject) => {
      const clientConfig = privates.get(client).config;

      const req = {
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        json: true
      };

      req.url = `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/deploymentconfigs/${deploymentConfigName}`;

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
  return function create (deploymentConfig, options) {
    return new Promise((resolve, reject) => {
      options = options || {};

      const clientConfig = privates.get(client).config;

      const req = {
        method: 'POST',
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        body: JSON.stringify(deploymentConfig)
      };

      req.url = `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/deploymentconfigs`;

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
