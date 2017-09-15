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
const fs = require('fs');

const privates = require('./private-map');

// Finds a buildconfig on a namespace and build(?) name
function find (client) {
  return function find (buildConfigName) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/buildconfigs/${buildConfigName}`
    };

    return request(client, req);
  };
}

// Uploads a .tar file to become an image
// options.dockerArchive is the location of the file
function instantiateBinary (client) {
  return function instantiateBinary (buildName, options) {
    options = options || {};
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'POST',
      json: false,
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/buildconfigs/${buildName}/instantiatebinary?commit=`,
      body: fs.createReadStream(options.dockerArchive)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

// Creates a buildconfig
// Takes a BuildConfig JSON object, defined here: https://docs.openshift.com/online/rest_api/openshift_v1.html#v1-buildconfig
function create (client) {
  return function create (buidConfig, options) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'POST',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/buildconfigs`,
      json: false,
      body: JSON.stringify(buidConfig)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

function remove (client) {
  return function remove (buildConfigName, options) {
    options = options || {};

    if (!buildConfigName) {
      return Promise.reject(new Error('Build Config Name is required'));
    }

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'DELETE',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/buildconfigs/${buildConfigName}`,
      body: options.body,
      qs: options.qs
    };

    return request(client, req);
  };
}

module.exports = {
  find: find,
  create: create,
  instantiateBinary: instantiateBinary,
  remove: remove
};
