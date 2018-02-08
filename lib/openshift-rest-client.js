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
const loadConfig = require('./config-loader');

const buildconfigs = require('./build-configs');
const builds = require('./builds');
const clusterrolebindings = require('./cluster-role-bindings');
const configMaps = require('./configmaps');
const deploymentconfigs = require('./deployment-config');
const groups = require('./groups');
const imagestreams = require('./imagestreams');
const pods = require('./pods');
const projectrequests = require('./projectrequests');
const projects = require('./projects');
const replicationcontrollers = require('./replication-controllers');
const rolebindings = require('./role-bindings');
const routes = require('./routes');
const secrets = require('./secrets');
const services = require('./services');

function bindModule (client, input) {
  if (typeof input === 'object') {
    const initializedModule = {};
    for (const name in input) {
      initializedModule[name] = bindModule(client, input[name]);
    }
    return initializedModule;
  } else if (typeof input === 'function') {
    return input(client);
  } else {
    throw new Error(`Unexpected input module type: ${input}`);
  }
}

/**
  @param {object} [settings] -
  @param {object} [settings.config] - overrides the default openshift configuration
  @param {object} [settings.openshiftConfigLoader] - settings to pass to the openshift-config-loader module
  @param {object} [settings.request] - settings to pass to the request module
  @returns {Promise} - Returns the Rest Client
*/
function openshiftClient (settings = {}) {
  const data = {};
  const client = {};

  Object.assign(client, bindModule(client, {
    buildconfigs: buildconfigs,
    builds: builds,
    clusterrolebindings: clusterrolebindings,
    configmaps: configMaps,
    deploymentconfigs: deploymentconfigs,
    groups: groups,
    imagestreams: imagestreams,
    pods: pods,
    projectrequests: projectrequests,
    projects: projects,
    replicationcontrollers: replicationcontrollers,
    rolebindings: rolebindings,
    routes: routes,
    secrets: secrets,
    services: services
  }));

  client.settings = settings;
  // A WeakMap reference to our private data
  // means that when all references to 'client' disappear
  // then the entry will be removed from the map
  privates.set(client, data);

  // Maybe load the config here?
  return loadConfig(client);
}

module.exports = exports = openshiftClient;
