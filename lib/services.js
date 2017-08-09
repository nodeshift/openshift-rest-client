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
const request = require('./common-request');

// Finds an image stream based on a namespace and build(?) name
function find (client) {
  return function find (serviceName) {
    const clientConfig = privates.get(client).config;

    // Using api here instead of oapi
    const req = {
      method: 'GET',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/services/${serviceName}`
    };

    return request(client, req);
  };
}

function create (client) {
  return function create (serviceConfig, options) {
    options = options || {};

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'POST',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/services`,
      json: false,
      body: JSON.stringify(serviceConfig)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

function remove (client) {
  return function remove (serviceName, options) {
    options = options || {};

    if (!serviceName) {
      return Promise.reject(new Error('Service Name is required'));
    }

    const clientConfig = privates.get(client).config;

    const req = {
      method: 'DELETE',
      url: `${client.kubeUrl}/namespaces/${clientConfig.context.namespace}/services/${serviceName}`
    };

    return request(client, req);
  };
}

module.exports = {
  find: find,
  create: create,
  remove: remove
};
