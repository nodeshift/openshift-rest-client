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

/**
  @module common-request

  Common module to make requests.  Wraps the request library in a Promise also
*/

const privates = require('./private-map');
const request = require('request');

module.exports = function doRequest (client, options) {
  return new Promise((resolve, reject) => {
    options = options || {};
    const requestSettings = (client.settings && client.settings.request) ? client.settings.request : {};
    const clientConfig = privates.get(client).config;

    const baseOptions = {
      auth: {
        bearer: clientConfig.user.token || '',
        ca: clientConfig.user.ca
      },
      json: true
    };

    // merge the 3 objects together, make the options be the thing that can override
    // request settings will be request specific stuff that is overriden during the initial creation of the client
    const req = Object.assign({}, baseOptions, options, requestSettings);

    const buildError = (body) => {
      const err = new Error(body.message);
      err.statusCode = body.code;
      return err;
    };

    request(req, (err, resp, body) => {
      if (err) return reject(buildError(err));

      // Need to reject on unauthorized and errors that are not 404
      if (resp.statusCode > 399 && resp.statusCode !== 404) {
        if (typeof body === 'string') {
          body = body.replace('\n', '');
          const newBody = {message: body, code: resp.statusCode};
          return reject(buildError(newBody));
        } else {
          return reject(buildError(body));
        }
      }

      // The body will i think be an Object
      return resolve(body);
    });
  });
};
