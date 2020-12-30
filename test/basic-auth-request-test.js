'use strict';

/* eslint standard/no-callback-literal: "off" */

const test = require('tape');
const proxyquire = require('proxyquire');

test('basic auth request', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, 'http://');
        return Promise.resolve('https://');
      }
    },
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      return cb(null, {
        statusCode: 200,
        request: {
          uri: {
            hash: '#access_token=9jXMEO87d7Rtf6FVQTFjumwIDbGeMzAtr2U010Z_ZG0&expires_in=86400&scope=user%3Afull&token_type=Bearer'
          }
        }
      });
    }
  });

  const settings = {
    url: 'http://',
    user: 'username',
    password: 'password',
    insecureSkipTlsVerify: true
  };

  const p = basicAuthRequest.getTokenFromBasicAuth(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.then((token) => {
    t.equal(token, '9jXMEO87d7Rtf6FVQTFjumwIDbGeMzAtr2U010Z_ZG0', 'should be equal');
    t.end();
  });
});

test('basic auth request with 404 status code', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, 'http://');
        return Promise.resolve('https://');
      }
    },
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      return cb(null, {
        statusCode: 404,
        request: {
          uri: {
            host: 'https://'
          }
        }
      });
    }
  });

  const settings = {
    url: 'http://',
    user: 'username',
    password: 'password',
    insecureSkipTlsVerify: true
  };

  const p = basicAuthRequest.getTokenFromBasicAuth(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message,
      'Unable to authenticate user username to https://. Cannot obtain access token from response.',
      'should be equal');
    t.end();
  });
});

test('basic auth request with 401 status code', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, 'http://');
        return Promise.resolve('https://');
      }
    },
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      return cb(null, {
        statusCode: 401,
        request: {
          uri: {
            host: 'https://'
          }
        }
      });
    }
  });

  const settings = {
    url: 'http://',
    user: 'username',
    password: 'password',
    insecureSkipTlsVerify: true
  };

  const p = basicAuthRequest.getTokenFromBasicAuth(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message,
      '401 Unable to authenticate user username',
      'should be equal');
    t.end();
  });
});

test('basic auth request with request error', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, undefined);
        return Promise.resolve('https://');
      }
    },
    request: (requestObject, cb) => {
      return cb({ message: 'Error' }, {});
    }
  });

  const settings = {};

  const p = basicAuthRequest.getTokenFromBasicAuth(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message, 'Error', 'should be equal');
    t.end();
  });
});
