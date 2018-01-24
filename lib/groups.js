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
  return function findAll (options = {}) {
    const req = {
      method: 'GET',
      url: `${client.apiUrl}/groups`,
      qs: options.qs
    };

    return request(client, req);
  };
}

function find (client) {
  return function find (groupName, options = {}) {
    if (!groupName) {
      return Promise.reject(new Error('Group Name is required'));
    }

    const req = {
      method: 'GET',
      url: `${client.apiUrl}/groups/${groupName}`
    };

    return request(client, req);
  };
}

function create (client) {
  return function create (group, options = {}) {
    const req = {
      method: 'POST',
      json: false,
      url: `${client.apiUrl}/groups`,
      body: JSON.stringify(group)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

function update (client) {
  return function create (groupName, group, options = {}) {
    if (!groupName) {
      return Promise.reject(new Error('Group Name is required'));
    }

    const req = {
      method: 'PUT',
      json: false,
      url: `${client.apiUrl}/groups/${groupName}`,
      body: JSON.stringify(group)
    };

    return request(client, req).then((body) => {
      return JSON.parse(body);
    });
  };
}

function remove (client) {
  return function remove (groupName, options = {}) {
    if (!groupName) {
      return Promise.reject(new Error('Group Name is required'));
    }

    const req = {
      method: 'DELETE',
      url: `${client.apiUrl}/groups/${groupName}`,
      qs: options.qs,
      body: options.body
    };

    return request(client, req);
  };
}

function removeAll (client) {
  return function removeAll (options = {}) {
    const req = {
      method: 'DELETE',
      url: `${client.apiUrl}/groups`,
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
