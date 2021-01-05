'use strict';

/* eslint standard/no-callback-literal: "off" */

const test = require('tape');
const proxyquire = require('proxyquire');

test('authorization server request', (t) => {
  const authorizationServerRequest = proxyquire('../lib/authorization-server-request', {
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      return cb(null, {
        statusCode: 200
      },
      '{"authorization_endpoint": "http://"}');
    }
  });

  const p = authorizationServerRequest.getAuthUrlFromOCP('http://', false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.then((url) => {
    t.equal(url, 'http://?response_type=token&client_id=openshift-challenging-client', 'should be equal');
    t.end();
  });
});

test('authorization server request without insecureSkipTlsVerify', (t) => {
  const authorizationServerRequest = proxyquire('../lib/authorization-server-request', {
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, true, 'should be true');
      return cb(null, {
        statusCode: 200
      },
      '{"authorization_endpoint": "http://"}');
    }
  });

  const p = authorizationServerRequest.getAuthUrlFromOCP('http://');

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.then((url) => {
    t.equal(url, 'http://?response_type=token&client_id=openshift-challenging-client', 'should be equal');
    t.end();
  });
});

test('authorization server request with empty body', (t) => {
  const authorizationServerRequest = proxyquire('../lib/authorization-server-request', {
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      return cb(null, {
        statusCode: 200,
        request: {
          uri: {
            host: 'https://'
          }
        }
      },
      '{}');
    }
  });

  const p = authorizationServerRequest.getAuthUrlFromOCP('http://', false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message,
      'Unable to retrieve the token_endpoint for https://. Cannot obtain token_endpoint from response.',
      'should be equal');
    t.end();
  });
});

test('authorization server request with 404 status code', (t) => {
  const authorizationServerRequest = proxyquire('../lib/authorization-server-request', {
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

  const p = authorizationServerRequest.getAuthUrlFromOCP('http://', false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message,
      '404 Unable to get the auth url',
      'should be equal');
    t.end();
  });
});

test('authorization server request with error', (t) => {
  const authorizationServerRequest = proxyquire('../lib/authorization-server-request', {
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      return cb({
        message: 'message',
        errorCode: 'code'
      }, null, null);
    }
  });

  const p = authorizationServerRequest.getAuthUrlFromOCP('http://', false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message,
      'message',
      'should be equal');
    t.end();
  });
});
