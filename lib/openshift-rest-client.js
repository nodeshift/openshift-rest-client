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

const projects = require('./projects');
const imagestreams = require('./imagestreams');
const buildconfigs = require('./build-configs');
const builds = require('./builds');
const services = require('./services');
const deploymentconfigs = require('./deployment-config');
const routes = require('./routes');
const replicationcontrollers = require('./replication-controllers');

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

function openshiftClient (config, settings) {
  settings = settings || {};

  const data = {};
  const client = {};

  Object.assign(client, bindModule(client, {
    projects: projects,
    buildconfigs: buildconfigs,
    builds: builds,
    imagestreams: imagestreams,
    services: services,
    deploymentconfigs: deploymentconfigs,
    routes: routes,
    replicationcontrollers: replicationcontrollers
  }));

  client.settings = settings;
  // A WeakMap reference to our private data
  // means that when all references to 'client' disappear
  // then the entry will be removed from the map
  privates.set(client, data);

  // Maybe load the config here?
  return loadConfig(client, config);
}

module.exports = exports = openshiftClient;
