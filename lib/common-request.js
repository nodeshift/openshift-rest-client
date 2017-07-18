'use strict';

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

    request(req, (err, resp, body) => {
      if (err) {
        return reject(err);
      }

      // Need to reject on unauthorized and errors that are not 404
      if (resp.statusCode > 399 && resp.statusCode !== 404) {
        return reject(body);
      }

      // The body will i think be an Object
      return resolve(body);
    });
  });
};
