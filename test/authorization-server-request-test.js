'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const BASE_URL = 'http://some.cluster.com:6443/';

function create (MockClient) {
  return proxyquire('../lib/authorization-server-request', {
    undici: {
      Client: MockClient
    }
  });
}

test('authorization server request', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    request (options) {
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 200,
          body: {
            json: () => {
              return Promise.resolve({
                authorization_endpoint: BASE_URL
              });
            }
          }
        });
      });
    }
  }

  const authorizationServerRequest = create(MockClient);
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
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.strictSSL, false, 'strictSSL should be false');
      t.equal(url, `${BASE_URL}`, 'url should be equal to base url');
      this.url = url;
    }

    request (options) {
      t.equal(this.url + options.path, `${BASE_URL}.well-known/oauth-authorization-server`);
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 200,
          body: {
            json: () => {
              return Promise.resolve({
                authorization_endpoint: BASE_URL
              });
            }
          }
        });
      });
    }
  }

  const authorizationServerRequest = create(MockClient);
  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL, false);

  t.equal(p instanceof Promise, true, 'response is an Promise');

  p.then((url) => {
    t.equal(
      url,
      `${BASE_URL}?response_type=token&client_id=openshift-challenging-client`,
      'authorization_endpoint should be equal'
    );
    t.end();
  });
});

test('authorization server request without insecureSkipTlsVerify', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.strictSSL, true, 'strictSSL should be true');
    }

    request (options) {
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 200,
          body: {
            json: () => {
              return Promise.resolve({
                authorization_endpoint: BASE_URL
              });
            }
          }
        });
      });
    }
  }

  const authorizationServerRequest = create(MockClient);
  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL);

  t.equal(p instanceof Promise, true, 'response is an Promise');

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
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.strictSSL, false, 'strictSSL should be false');
    }

    request (options) {
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 200,
          body: {
            json: () => {
              return Promise.resolve({});
            }
          }
        });
      });
    }
  }

  const authorizationServerRequest = create(MockClient);
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
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.strictSSL, false, 'strictSSL should be false');
    }

    request (options) {
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 404
        });
      });
    }
  }

  const authorizationServerRequest = create(MockClient);
  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL, false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message, '404 Unable to get the auth url', 'should be equal');
    t.end();
  });
});

test('authorization server request with error', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.strictSSL, false, 'strictSSL should be false');
    }

    request (options) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ message: 'message', errorCode: 'code' });
    }
  }

  const authorizationServerRequest = create(MockClient);
  const p = authorizationServerRequest.getAuthUrlFromOCP(BASE_URL, false);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message, 'message', 'should be equal');
    t.end();
  });
});
