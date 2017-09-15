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

// find a list of secrets
function findAll (client) {
  return function findAll (options) {
    options = options || {};
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/secrets`,
      qs: options.qs
    };

    return request(client, req);
  };
}

// find just 1 secret
// This could probably combined into 1 method with the above findAll
function find (client) {
  return function find (secretName, options) {
    options = options || {};
    if (!secretName) {
      return Promise.reject(new Error('Secret Name is required'));
    }
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/secrets/${secretName}`,
      qs: options.qs
    };

    return request(client, req);
  };
}

function create (client) {
  return function create (secretConfig, options) {
    options = options || {};

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'POST',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/secrets`,
      json: false,
      body: JSON.stringify(secretConfig)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

function remove (client) {
  return function remove (secretName, options) {
    options = options || {};

    if (!secretName) {
      return Promise.reject(new Error('Secret Name is required'));
    }

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'DELETE',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/secrets/${secretName}`,
      body: options.body,
      qs: options.qs
    };

    return request(client, req);
  };
}

function removeAll (client) {
  return function removeAll (options) {
    options = options || {};

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'DELETE',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/secrets`,
      qs: options.qs
    };

    return request(client, req);
  };
}

module.exports = {
  findAll: findAll,
  find: find,
  create: create,
  remove: remove,
  removeAll: removeAll
};
