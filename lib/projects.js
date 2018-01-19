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

function findAll (client) {
  return function findAll (options) {
    options = options || {};

    const req = {
      method: 'GET',
      qs: options.qs,
      url: `${client.apiUrl}/projects`
    };

    return request(client, req);
  };
}

function find (client) {
  return function find (projectName, options) {
    options = options || {};
    if (!projectName) {
      return Promise.reject(new Error('Project Name is required'));
    }

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/projects/${projectName}`
    };

    return request(client, req);
  };
}

function remove (client) {
  return function remove (projectName) {
    if (!projectName) {
      return Promise.reject(new Error('Project Name is required'));
    }

    const req = {
      method: 'DELETE',
      url: `${client.apiUrl}/projects/${projectName}`
    };

    return request(client, req);
  };
}

module.exports = {
  findAll: findAll,
  find: find,
  remove: remove
};
