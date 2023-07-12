'use strict';

const { Client } = require('undici');
const { getAuthUrlFromOCP } = require('./authorization-server-request');

const buildError = (requestError) => {
  const err = new Error(requestError.message);
  err.statusCode = requestError.code;
  return err;
};

// Use this function if a user passes in just an auth token
// This will return a User Openshift Object
async function getUserFromAuthToken (settings) {
  return new Promise((resolve, reject) => {
    const client = new Client(settings.url, {
      connect: {
        strictSSL: 'insecureSkipTlsVerify' in settings ? !settings.insecureSkipTlsVerify : true
      }
    });
    const requestOptions = {
      path: '/apis/user.openshift.io/v1/users/~',
      method: 'GET',
      headers: { Authorization: `Bearer ${settings.token}` }
    };
    client.request(requestOptions).then(async (responseData) => {
      if (responseData.statusCode === 401) {
        return reject(new Error(`401 Unable to authenticate with token ${settings.token}`));
      }
      return resolve(await responseData.body.json());
    }).catch((err) => {
      return reject(buildError(err));
    });
  });
}

async function getTokenFromBasicAuth (settings) {
  // Get the Auth URL from Openshift endpoint
  const authUrl = await getAuthUrlFromOCP(settings.url, 'insecureSkipTlsVerify' in settings ? !settings.insecureSkipTlsVerify : true);
  return new Promise((resolve, reject) => {
    const credentials = `${settings.user}:${settings.password}`;
    const auth = `Basic ${Buffer.from(credentials).toString('base64')}`;
    const parsedAuthURL = new URL(authUrl);

    const client = new Client(parsedAuthURL.origin, {
      connect: {
        strictSSL: 'insecureSkipTlsVerify' in settings ? !settings.insecureSkipTlsVerify : true
      }
    });

    const requestOptions = {
      path: parsedAuthURL.pathname + parsedAuthURL.search,
      method: 'GET',
      headers: { Authorization: auth }
    };

    /*
    const req = {
      method: 'GET',
      url: authUrl,
      headers: {
        Authorization: auth
      },
      strictSSL: 'insecureSkipTlsVerify' in settings ? !settings.insecureSkipTlsVerify : true
    };
    */

    client.request(requestOptions).then(async (responseData) => {
      if (responseData.statusCode === 401) {
        return reject(new Error(`401 Unable to authenticate user ${settings.user}`));
      }

      const location = responseData.headers.location;
      const parsedLocation = new URL(location);

      const hash = parsedLocation.hash;
      if (hash) {
        const startIndex = hash.indexOf('=') + 1;
        const stopIndex = hash.indexOf('&');
        const accessToken = hash.slice(startIndex, stopIndex);
        return resolve(accessToken);
      } else {
        return reject(new Error(`Unable to authenticate user ${settings.user} to ${settings.url}. Cannot obtain access token from response.`));
      }
    }).catch((err) => {
      return reject(buildError(err));
    });

    /*
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
    */
  });
}

module.exports = {
  getTokenFromBasicAuth,
  getUserFromAuthToken
};
