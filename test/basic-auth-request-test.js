'use strict';

/* eslint standard/no-callback-literal: "off" */

const test = require('tape');
const proxyquire = require('proxyquire');

test('basic auth request', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
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

test('basic auth request with request error', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
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

test('basic auth request with 401 error', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    request: (requestObject, cb) => {
      return cb(null, {
        statusCode: 401
      });
    }
  });

  const settings = {
    user: 'username'
  };

  const p = basicAuthRequest.getTokenFromBasicAuth(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message, '401 Unable to authenticate user username', 'should be equal');
    t.end();
  });
});

test('basic auth request with defined auth url', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    request: (requestObject, cb) => {
      t.true(requestObject.url.includes('https://test'), 'Unexpected auth url value');
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
    authUrl: 'https://test',
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
