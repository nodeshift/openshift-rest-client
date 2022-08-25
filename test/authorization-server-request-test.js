'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const BASE_URL = 'http://some.cluster.com:6443/';

test('authorization server request', (t) => {
  const authorizationServerRequest = proxyquire(
    '../lib/authorization-server-request',
    {
      request: (requestObject, cb) => {
        t.equal(requestObject.strictSSL, false, 'should be false');
        return cb(
          null,
          {
            statusCode: 200
          },
          `{"authorization_endpoint": "${BASE_URL}"}`
        );
      }
    }
  );

  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL, false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.then((url) => {
    t.equal(
      url,
      `${BASE_URL}?response_type=token&client_id=openshift-challenging-client`,
      'should be equal'
    );
    t.end();
  });
});

test('authorization server request URL join safety', (t) => {
  const authorizationServerRequest = proxyquire(
    '../lib/authorization-server-request',
    {
      request: (requestObject, cb) => {
        t.equal(requestObject.strictSSL, false, 'should be false');
        t.equal(
          requestObject.url,
          `${BASE_URL}.well-known/oauth-authorization-server`
        );
        return cb(
          null,
          {
            statusCode: 200
          },
          `{"authorization_endpoint": "${BASE_URL}"}`
        );
      }
    }
  );

  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL, false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.then((url) => {
    t.equal(
      url,
      `${BASE_URL}?response_type=token&client_id=openshift-challenging-client`,
      'should be equal'
    );
    t.end();
  });
});

test('authorization server request without insecureSkipTlsVerify', (t) => {
  const authorizationServerRequest = proxyquire(
    '../lib/authorization-server-request',
    {
      request: (requestObject, cb) => {
        t.equal(requestObject.strictSSL, true, 'should be true');
        return cb(
          null,
          {
            statusCode: 200
          },
          `{"authorization_endpoint": "${BASE_URL}"}`
        );
      }
    }
  );

  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.then((url) => {
    t.equal(
      url,
      `${BASE_URL}?response_type=token&client_id=openshift-challenging-client`,
      'should be equal'
    );
    t.end();
  });
});

test('authorization server request with empty body', (t) => {
  const authorizationServerRequest = proxyquire(
    '../lib/authorization-server-request',
    {
      request: (requestObject, cb) => {
        t.equal(requestObject.strictSSL, false, 'should be false');
        return cb(
          null,
          {
            statusCode: 200,
            request: {
              uri: {
                host: BASE_URL
              }
            }
          },
          '{}'
        );
      }
    }
  );

  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL, false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(
      error.message,
      `Unable to retrieve the token_endpoint for ${BASE_URL}. Cannot obtain token_endpoint from response.`,
      'should be equal'
    );
    t.end();
  });
});

test('authorization server request with 404 status code', (t) => {
  const authorizationServerRequest = proxyquire(
    '../lib/authorization-server-request',
    {
      request: (requestObject, cb) => {
        t.equal(requestObject.strictSSL, false, 'should be false');
        return cb(null, {
          statusCode: 404,
          request: {
            uri: {
              host: BASE_URL
            }
          }
        });
      }
    }
  );

  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL, false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message, '404 Unable to get the auth url', 'should be equal');
    t.end();
  });
});

test('authorization server request with error', (t) => {
  const authorizationServerRequest = proxyquire(
    '../lib/authorization-server-request',
    {
      request: (requestObject, cb) => {
        t.equal(requestObject.strictSSL, false, 'should be false');

        const message = {
          message: 'message',
          errorCode: 'code'
        };
        return cb(message, null, null);
      }
    }
  );

  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL, false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message, 'message', 'should be equal');
    t.end();
  });
});
