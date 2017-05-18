'use strict';

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
      auth: {
        bearer: clientConfig.user.token
      },
      strictSSL: false, // Just for testing since self signed certs
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

module.exports = {
  find: find,
  create: create,
  instantiateBinary: instantiateBinary
};
