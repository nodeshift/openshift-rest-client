'use strict';

const { Client } = require('undici');

const buildError = (requestError) => {
  const err = new Error(requestError.message);
  err.statusCode = requestError.code;
  return err;
};

/**
 * This method allows to retrieve automatically the authorization endpoint from the api
 * compatible with OCP 3.x and OCP 4.x
 * @param {string} url openshift platform api url
 * @param {boolean} insecureSkipTlsVerify validate ssl
 */
const getAuthUrlFromOCP = async (url, insecureSkipTlsVerify = true) => {
  return new Promise((resolve, reject) => {
    const client = new Client(url, {
      connect: {
        strictSSL: insecureSkipTlsVerify
      }
    });
    const requestOptions = {
      path: '/.well-known/oauth-authorization-server',
      method: 'GET'
    };
    client.request(requestOptions).then(async (responseData) => {
      if (responseData.statusCode === 404) {
        return reject(new Error('404 Unable to get the auth url'));
      }
      const bodyJSON = await responseData.body.json();
      if (bodyJSON.authorization_endpoint) {
        return resolve(`${bodyJSON.authorization_endpoint}?response_type=token&client_id=openshift-challenging-client`);
      } else {
        return reject(new Error(`Unable to retrieve the token_endpoint for ${url}. Cannot obtain token_endpoint from response.`));
      }
    }).catch((err) => {
      return reject(buildError(err));
    });
  });
};

module.exports = {
  getAuthUrlFromOCP
};
