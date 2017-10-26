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

const request = require('./common-request');

const privates = require('./private-map');

// Finds a buildconfig on a namespace and build(?) name
function find (client) {
  return function find (buildName) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/builds/${buildName}`
    };

    return request(client, req);
  };
}

// find all builds
// Returns a BuildList object https://docs.openshift.com/container-platform/3.5/rest_api/openshift_v1.html#v1-buildlist
function findAll (client) {
  return function findAll (options = {}) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/builds`,
      qs: options.qs
    };

    return request(client, req);
  };
}

// remove build based on the buildname
function remove (client) {
  return function remove (buildName, options = {}) {
    const clientConfig = privates.get(client).config;

    if (!buildName) {
      return Promise.reject(new Error('Build Name is required'));
    }

    const req = {
      method: 'DELETE',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/builds/${buildName}`,
      body: options.body,
      qs: options.qs
    };

    return request(client, req);
  };
}

module.exports = {
  find: find,
  findAll: findAll,
  remove: remove
};
