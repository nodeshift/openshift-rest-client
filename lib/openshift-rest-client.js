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
const configmaps = require('./configmaps');
const deploymentconfigs = require('./deployment-config');
const deployments = require('./deployments');
const events = require('./events');
const groups = require('./groups');
const imagestreams = require('./imagestreams');
const imagestreamtags = require('./imagestreamtags');
const ingress = require('./ingress');
const persistentvolumeclaims = require('./persistent-volume-claims');
const pods = require('./pods');
const projectrequests = require('./projectrequests');
const projects = require('./projects');
const replicationcontrollers = require('./replication-controllers');
const rolebindings = require('./role-bindings');
const routes = require('./routes');
const secrets = require('./secrets');
const services = require('./services');
const serviceinstances = require('./serviceinstances');
const statefulsets = require('./statefulsets');

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
    buildconfigs,
    builds,
    clusterrolebindings,
    configmaps,
    deployments,
    deploymentconfigs,
    events,
    groups,
    imagestreams,
    imagestreamtags,
    ingress,
    persistentvolumeclaims,
    pods,
    projectrequests,
    projects,
    replicationcontrollers,
    rolebindings,
    routes,
    secrets,
    services,
    serviceinstances,
    statefulsets
  }));

  client.settings = settings;

  if (client.settings.config !== undefined) {
    const url = client.settings.config.cluster;
    client.settings.config.cluster = url.endsWith('/') ? url.slice(0, url.length - 1) : url;
  }

  // A WeakMap reference to our private data
  // means that when all references to 'client' disappear
  // then the entry will be removed from the map
  privates.set(client, data);

  // Maybe load the config here?
  return loadConfig(client);
}

module.exports = exports = openshiftClient;
