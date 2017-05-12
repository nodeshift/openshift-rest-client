'use strict';

const request = require('request');
const fs = require('fs');

const privates = require('./private-map');

// Finds a buildconfig on a namespace and build(?) name
function find (client) {
  return function find (buildConfigName) {
    return new Promise((resolve, reject) => {
      const clientConfig = privates.get(client).config;

      const req = {
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        json: true
      };

      req.url = `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/buildconfigs/${buildConfigName}`;

      request(req, (err, response, body) => {
        if (err) {
          return reject(err);
        }

        return resolve(body);
      });
    });
  };
}

function instantiateBinary (client) {
  return function instantiateBinary (buildName, options) {
    return new Promise((resolve, reject) => {
      options = options || {};

      console.log(options);

      const clientConfig = privates.get(client).config;

      const req = {
        method: 'POST',
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        body: fs.createReadStream(options.dockerArchive)
      };

      req.url = `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/buildconfigs/${buildName}/instantiatebinary?commit=`;

      request(req, (err, response, body) => {
        if (err) {
          return reject(err);
        }

        return resolve(body);
      });
    });
  };
}

module.exports = {
  find: find,
  instantiateBinary: instantiateBinary
};
