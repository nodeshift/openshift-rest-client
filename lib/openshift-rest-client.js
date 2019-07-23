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

const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

const { Client, config, alias } = require('kubernetes-client');
const { getTokenFromBasicAuth } = require('./basic-auth-request');

const serviceCatalogCRD = require('./specs/service-catalog-crd.json');

// A list of shorthand aliases
const resourceAliases = {
  'apps.openshift.io': ['app'],
  'authorization.openshift.io': ['authorization'],
  'build.openshift.io': ['build'],
  'image.openshift.io': ['image'],
  'network.openshift.io': ['network'],
  'oauth.openshift.io': ['oauth'],
  'project.openshift.io': ['project'],
  'quota.openshift.io': ['quota'],
  'route.openshift.io': ['route'],
  'security.openshift.io': ['security'],
  'template.openshift.io': ['template'],
  'user.openshift.io': ['user']
};

// function is passed in and called by the kubernetes-client to add the openshift aliases
function getNames (resourceType) {
  const aliases = [resourceType];
  if (resourceAliases[resourceType]) {
    return aliases.concat(resourceAliases[resourceType]);
  }
  return alias(resourceType);
}

// unzip and load the openshift openapi swagger spec file
// Doesn't look like there is a way to query this from a running cluster
// Perhaps, we could try to query https://raw.githubusercontent.com/openshift/origin/master/api/swagger-spec/openshift-openapi-spec.json ?
const spec = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(__dirname, 'specs', 'openshift-openapi-spec.json.gz'))));

/**
  @param {object} [settings] -
  @returns {Promise} - Returns the Rest Client
*/
async function openshiftClient (settings = {}) {
  let kubeconfig = settings.config;

  if (kubeconfig) {
    // A config is being passed in.  Check if it is an object
    if (typeof kubeconfig === 'object' && kubeconfig.auth) {
      // Check for the auth username password
      if ('user' in kubeconfig.auth || 'username' in kubeconfig.auth) {
        // They are trying the basic auth.
        // Get the access token using the username and password
        // Check to see if we are passing in a username/password
        const accessToken = await getTokenFromBasicAuth({ insecureSkipTlsVerify: kubeconfig.insecureSkipTlsVerify, url: kubeconfig.url, user: kubeconfig.auth.username || kubeconfig.auth.user, password: kubeconfig.auth.password || kubeconfig.auth.pass });

        kubeconfig = {
          url: kubeconfig.url,
          auth: {
            bearer: accessToken
          },
          insecureSkipTlsVerify: 'insecureSkipTlsVerify' in kubeconfig ? Boolean(kubeconfig.insecureSkipTlsVerify) : false
        };
      }
    }
  }

  const client = new Client({ config: kubeconfig || config.fromKubeconfig(), spec, getNames: getNames });

  // CRD with the service instance stuff, but only to this client, not the cluster
  client.addCustomResourceDefinition(serviceCatalogCRD);
  return client;
}

module.exports = exports = openshiftClient;
