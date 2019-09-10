'use strict';

const request = require('request');

/**
 * Builds a custom error based on the `error` provided by request module.
 * @param {Object} requestError The request error object from request module.
 * @returns {Object} The custom error.
 */
const buildError = (requestError) => {
  const err = new Error(requestError.message);
  err.statusCode = requestError.code;
  return err;
};

/**
 * Builds a custom request object and makes a http request to retrieve an access token.
 * @param {Object} settings The settings object which contains username and password.
 * @returns {Promise} Promise object to resolve with the new access token.
 */
async function getTokenFromBasicAuth (settings) {
  return new Promise((resolve, reject) => {
    const authUrl = `${settings.url}/oauth/authorize?response_type=token&client_id=openshift-challenging-client`;
    const credentials = `${settings.user}:${settings.password}`;
    const auth = `Basic ${Buffer.from(credentials).toString('base64')}`;

    const req = {
      method: 'GET',
      url: authUrl,
      headers: {
        Authorization: auth
      },
      strictSSL: 'insecureSkipTlsVerify' in settings ? !settings.insecureSkipTlsVerify : true
    };

    request(req, (err, resp, body) => {
      if (err) return reject(buildError(err));

      if (resp.statusCode === 401) {
        return reject(new Error(`401 Unable to authenticate user ${settings.user}`));
      }

      const hash = resp.request.uri.hash;
      const startIndex = hash.indexOf('=') + 1;
      const stopIndex = hash.indexOf('&');
      const accessToken = hash.slice(startIndex, stopIndex);

      return resolve(accessToken);
    });
  });
}

module.exports = {
  getTokenFromBasicAuth
};
