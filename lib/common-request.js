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
    const clientConfig = privates.get(client).config;

    const baseOptions = {
      auth: {
        bearer: clientConfig.user.token || ''
      },
      strictSSL: false, // Just for testing since self signed certs
      json: true
    };

    // merge the 2 objects together, make the options be the thing that can override
    const req = Object.assign({}, baseOptions, options);

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
