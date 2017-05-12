'use strict';

const os = require('os');
const fs = require('fs');

const privates = require('./private-map');
const yamlParser = require('./yaml-parser');

const DEFAULT_CONFIG_LOCATION = `${os.homedir()}/.kube/config`;

// Returns a promise
function loadConfig (client) {
  return new Promise((resolve, reject) => {
    // First, load the config file from the default location. TODO: make configurable
    fs.readFile(DEFAULT_CONFIG_LOCATION, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }

      // Second, parse yaml file to JSON
      const jsonConfig = yamlParser.yamlToJson(data);

      // Third, find the current context in the config, and then get the user for that context?
      const currentContext = jsonConfig.contexts.filter((v) => {
        return v.name === jsonConfig['current-context'];
      })[0];

      const currentUser = jsonConfig.users.filter((u) => {
        return u.name === currentContext.context.user;
      })[0];

      const currentCluster = jsonConfig.clusters.filter((c) => {
        return c.name === currentContext.context.cluster;
      })[0];

      client.apiUrl = `${currentCluster.cluster.server}/oapi/${jsonConfig.apiVersion}`;

      privates.get(client).config = Object.assign({},
        {context: currentContext.context},
        {user: currentUser.user},
        {cluster: currentCluster.cluster.server}
      );

      return resolve(client);
    });
  });
}

module.exports = loadConfig;
