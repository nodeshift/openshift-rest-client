'use strict';

const privates = require('./private-map');
const request = require('request');

module.exports = {
  find: find
};

function find (client) {
  return function find () {
    return new Promise((resolve, reject) => {
      const clientConfig = privates.get(client).config;

      const req = {
        auth: {
          bearer: clientConfig.user.token
        },
        strictSSL: false, // Just for testing since self signed certs
        json: true
      };

      req.url = `${client.apiUrl}/projects`;

      request(req, (err, response, body) => {
        if (err) {
          return reject(err);
        }

        if (response.statusCode !== 200) {
          return reject(body);
        }

        return resolve(body);
      });
    });
  };
}
