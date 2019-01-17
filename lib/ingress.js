'use strict';

/*
 *
 *  Copyright Red Hat, Inc. and individual contributors.
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
    const namespace = options.namespace || clientConfig.context.namespace;

    const url =
      `${clientConfig.cluster}${client.apis.v1beta1.endpoints()
        .extensions}/namespaces/${clientConfig
        .context.namespace}/ingresses`;

    const req = {
      method: 'GET',
      url,
      qs: options.qs
    };

    return request(client, req);
  };
}

function find (client) {
  return function find (ingresName, options = {}) {
    if (!ingresName) {
      return Promise.reject(new Error('Ingress Name is required'));
    }

    const clientConfig = privates.get(client).config;
    const namespace = options.namespace || clientConfig.context.namespace;

    const url =
      `${clientConfig.cluster}${client.apis.v1beta1.endpoints()
        .extensions}/namespaces/${namespace}/ingresses/${ingresName}`;

    const req = {
      method: 'GET',
      url
    };

    return request(client, req);
  };
}

function create (client) {
  return function create (ingress, options = {}) {
    const clientConfig = privates.get(client).config;
    const namespace = options.namespace || clientConfig.context.namespace;
    
    const url =
      `${clientConfig.cluster}${client.apis.v1beta1.endpoints()
        .extensions}/namespaces/${namespace}/ingresses`;

    const req = {
      method: 'POST',
      url,
      json: false,
      body: JSON.stringify(ingress)
    };

    return request(client, req).then(body => {
      return JSON.parse(body);
    });
  };
}

function update (client) {
  return function create (name, ingress, options = {}) {
    if (!name) {
      return Promise.reject(new Error('Ingress Name is required'));
    }

    const clientConfig = privates.get(client).config;
    const namespace = options.namespace || clientConfig.context.namespace;

    const url =
      `${clientConfig.cluster}${client.apis.v1beta1.endpoints()
        .extensions}/namespaces/${namespace}/ingresses/${name}`;

    const req = {
      method: 'PUT',
      json: false,
      url,
      body: JSON.stringify(ingress)
    };

    return request(client, req).then(body => {
      return JSON.parse(body);
    });
  };
}

function remove (client) {
  return function remove (name, options = {}) {
    if (!name) {
      return Promise.reject(new Error('Ingress Name is required'));
    }
    const clientConfig = privates.get(client).config;
    const namespace = options.namespace || clientConfig.context.namespace;

    const url =
      `${clientConfig.cluster}${client.apis.v1beta1.endpoints()
        .extensions}/namespaces/${namespace}/ingresses/${name}`;

    const req = {
      method: 'DELETE',
      url,
      body: options.body,
      qs: options.qs
    };

    return request(client, req);
  };
}

function removeAll (client) {
  return function removeAll (options = {}) {
    const clientConfig = privates.get(client).config;
    const namespace = options.namespace || clientConfig.context.namespace;

    const url =
      `${clientConfig.cluster}${client.apis.v1beta1.endpoints()
        .extensions}/namespaces/${namespace}/ingresses`;

    const req = {
      method: 'DELETE',
      url,
      qs: options.qs
    };

    return request(client, req);
  };
}

module.exports = {
  findAll,
  find,
  create,
  update,
  remove,
  removeAll
};
