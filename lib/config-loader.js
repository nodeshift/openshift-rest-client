'use strict';

/*
 *
 *  Copyright 2016-2017 Red Hat, Inc, and individual contributors.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 *
 */

const privates = require('./private-map');
const openshiftConfigLoader = require('openshift-config-loader');

function load (settings) {
  if (settings.config) {
    return Promise.resolve(settings.config);
  }

  return openshiftConfigLoader(settings.openshiftConfigLoader);
}

// Takes a config object as JSON
// Returns a promise
function loadConfig (client) {
  return load(client.settings).then((config) => {
    client.apiUrl = `${config.cluster}/oapi/${config.apiVersion}`;
    client.kubeUrl = `${config.cluster}/api/${config.apiVersion}`;

    privates.get(client).config = config;

    return client;
  });
}

module.exports = loadConfig;
