'use strict';

const privates = require('./private-map');

// Takes a config object as JSON
// Returns a promise
function loadConfig (client, config) {
  return new Promise((resolve, reject) => {
    if (!config) {
      return reject(new Error('Config object is require'));
    }

    client.apiUrl = `${config.cluster}/oapi/${config.apiVersion}`;
    client.kubeUrl = `${config.cluster}/api/${config.apiVersion}`;

    privates.get(client).config = config;

    resolve(client);
  });
}

module.exports = loadConfig;
