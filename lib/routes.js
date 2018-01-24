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

function findAll (client) {
  return function findAll (options = {}) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes`,
      qs: options.qs
    };

    return request(client, req);
  };
}

function find (client) {
  return function find (routeName, options = {}) {
    const clientConfig = privates.get(client).config;

    if (!routeName) {
      return Promise.reject(new Error('Route Name is required'));
    }

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes/${routeName}`
    };

    return request(client, req);
  };
}

function create (client) {
  return function create (route, options = {}) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'POST',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes`,
      json: false,
      body: JSON.stringify(route)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

function update (client) {
  return function create (routeName, route, options = {}) {
    const clientConfig = privates.get(client).config;

    if (!routeName) {
      return Promise.reject(new Error('Route Name is required'));
    }

    const req = {
      method: 'PUT',
      json: false,
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes/${routeName}`,
      body: JSON.stringify(route)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

function remove (client) {
  return function remove (routeName, options = {}) {
    const clientConfig = privates.get(client).config;

    if (!routeName) {
      return Promise.reject(new Error('Route Name is required'));
    }

    const req = {
      method: 'DELETE',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes/${routeName}`,
      body: options.body,
      qs: options.qs
    };

    return request(client, req);
  };
}

function removeAll (client) {
  return function removeAll (options = {}) {
    const clientConfig = privates.get(client).config;

    const req = {
      method: 'DELETE',
      url: `${client.apiUrl}/namespaces/${clientConfig.context.namespace}/routes`,
      qs: options.qs
    };

    return request(client, req);
  };
}

module.exports = {
  findAll: findAll,
  find: find,
  create: create,
  update: update,
  remove: remove,
  removeAll: removeAll
};
