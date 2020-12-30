'use strict';

const request = require('request');

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
  const req = {
    method: 'GET',
    url: `${url}/.well-known/oauth-authorization-server`,
    strictSSL: insecureSkipTlsVerify
  };

  return new Promise((resolve, reject) => {
    request(req, (err, resp, body) => {
      if (err) return reject(buildError(err));

      if (resp.statusCode === 404) {
        return reject(new Error('404 Unable to get the auth url'));
      }
      const bodyJSON = JSON.parse(body);
      if (bodyJSON.authorization_endpoint) {
        return resolve(`${bodyJSON.authorization_endpoint}?response_type=token&client_id=openshift-challenging-client`);
      } else {
        return reject(new Error(`Unable to retrieve the token_endpoint for ${resp.request.uri.host}. Cannot obtain token_endpoint from response.`));
      }
    });
  });
};

async function getTokenFromBasicAuth (settings) {
  // Get the Auth URL from Openshift endpoint
  const authUrl = await getAuthUrlFromOCP(settings.url, 'insecureSkipTlsVerify' in settings ? !settings.insecureSkipTlsVerify : true);
  return new Promise((resolve, reject) => {
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
      if (hash) {
        const startIndex = hash.indexOf('=') + 1;
        const stopIndex = hash.indexOf('&');
        const accessToken = hash.slice(startIndex, stopIndex);
        return resolve(accessToken);
      } else {
        return reject(new Error(`Unable to authenticate user ${settings.user} to ${resp.request.uri.host}. Cannot obtain access token from response.`));
      }
    });
  });
}

module.exports = {
  getTokenFromBasicAuth
};
