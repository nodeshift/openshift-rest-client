'use strict';

const privates = require('./private-map');
const request = require('request');

// Finds an image stream based on a namespace and build(?) name
function find (client) {
  return function find (imageStreamName) {
    return new Promise((resolve, reject) => {
      const clientConfig = privates.get(client).config;

      const req = {
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        json: true
      };

      req.url = `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/imagestreams/${imageStreamName}`;

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
  find: find
};
