'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const BASE_URL = 'http://some.cluster.com:6443';

test('basic auth request', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.rejectUnauthorized, false, 'rejectUnauthorized should be false');
    }

    request (options) {
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 200,
          headers: {
            location: 'https://oauth.u8qdh-6t6qc-66m.1742.p3.openshiftapps.com#access_token=9jXMEO87d7Rtf6FVQTFjumwIDbGeMzAtr2U010Z_ZG0&expires_in=86400&scope=user%3Afull&token_type=Bearer'
          }
        });
      });
    }
  }
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, BASE_URL);
        return Promise.resolve(BASE_URL);
      }
    },
    undici: {
      Client: MockClient
    }
  });

  const settings = {
    url: BASE_URL,
    user: 'username',
    password: 'password',
    insecureSkipTlsVerify: true
  };

  const p = basicAuthRequest.getTokenFromBasicAuth(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.then((token) => {
    t.equal(
      token,
      '9jXMEO87d7Rtf6FVQTFjumwIDbGeMzAtr2U010Z_ZG0',
      'should be equal'
    );
    t.end();
  });
});

test('basic auth request with 404 status code', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.rejectUnauthorized, false, 'rejectUnauthorized should be false');
    }

    request (options) {
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 404,
          body: {
            json: () => {
              return Promise.resolve({
                uri: {
                  host: BASE_URL
                }
              });
            }
          }
        });
      });
    }
  }
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, BASE_URL);
        return Promise.resolve(BASE_URL);
      }
    },
    undici: {
      Client: MockClient
    }
  });

  const settings = {
    url: BASE_URL,
    user: 'username',
    password: 'password',
    insecureSkipTlsVerify: true
  };

  const p = basicAuthRequest.getTokenFromBasicAuth(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(
      error.message,
      `404 authentication url of ${settings.url} not found`,
      'should be equal'
    );
    t.end();
  });
});

test('basic auth request with 401 status code', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.rejectUnauthorized, false, 'rejectUnauthorized should be false');
    }

    request (options) {
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 401,
          body: {
            json: () => {
              return Promise.resolve({
                uri: {
                  host: BASE_URL
                }
              });
            }
          }
        });
      });
    }
  }
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, BASE_URL);
        return Promise.resolve(BASE_URL);
      }
    },
    undici: {
      Client: MockClient
    }
  });

  const settings = {
    url: BASE_URL,
    user: 'username',
    password: 'password',
    insecureSkipTlsVerify: true
  };

  const p = basicAuthRequest.getTokenFromBasicAuth(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(
      error.message,
      '401 Unable to authenticate user username',
      'should be equal'
    );
    t.end();
  });
});

test('basic auth request with request error', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    request (options) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ message: 'Error' });
    }
  }
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, undefined);
        return Promise.resolve(BASE_URL);
      }
    },
    undici: {
      Client: MockClient
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

// Getting the User from a Token Tests

test('get user from token', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.rejectUnauthorized, false, 'rejectUnauthorized should be false');
    }

    request (options) {
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 200,
          body: {
            json: () => {
              return Promise.resolve({
                kind: 'User',
                metadata: {
                  name: 'developer'
                }
              });
            }
          }
        });
      });
    }
  }
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, BASE_URL);
        return Promise.resolve(BASE_URL);
      }
    },
    undici: {
      Client: MockClient
    }
  });

  const settings = {
    url: BASE_URL,
    token: '12346',
    insecureSkipTlsVerify: true
  };

  const p = basicAuthRequest.getUserFromAuthToken(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.then((userObject) => {
    t.equal(userObject.metadata.name, 'developer', 'user should be equal');
    t.end();
  });
});

test('get user from token URL join safety', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.rejectUnauthorized, false, 'rejectUnauthorized should be false');
      t.equal(url, `${BASE_URL}`, 'url should be equal to base url');
      this.url = url;
    }

    request (options) {
      t.equal(this.url + options.path, `${BASE_URL}/apis/user.openshift.io/v1/users/~`);
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 200,
          body: {
            json: () => {
              return Promise.resolve({
                kind: 'User',
                metadata: {
                  name: 'developer'
                }
              });
            }
          }
        });
      });
    }
  }
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    undici: {
      Client: MockClient
    }
  });

  const settings = {
    url: BASE_URL, // note the trailing slash
    token: '12346',
    insecureSkipTlsVerify: true
  };

  const p = basicAuthRequest.getUserFromAuthToken(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.then((userObject) => {
    t.equal(userObject.metadata.name, 'developer', 'user should be equal');
    t.end();
  });
});

test('get user from token with 401 status code', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    constructor (url, options) {
      t.equal(options.connect.rejectUnauthorized, false, 'rejectUnauthorized should be false');
    }

    request (options) {
      return new Promise((resolve, reject) => {
        resolve({
          statusCode: 401,
          body: {
            json: () => {
              return Promise.resolve({
                uri: {
                  host: BASE_URL
                }
              });
            }
          }
        });
      });
    }
  }
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    undici: {
      Client: MockClient
    }
  });

  const settings = {
    url: BASE_URL,
    token: '12346',
    insecureSkipTlsVerify: true
  };

  const p = basicAuthRequest.getUserFromAuthToken(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(
      error.message,
      '401 Unable to authenticate with token 12346',
      'should be equal'
    );
    t.end();
  });
});

test('get user from token with request error', (t) => {
  class MockClient {
    static '@noCallThru' = true;

    request (options) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ message: 'Error' });
    }
  }
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    undici: {
      Client: MockClient
    }
  });

  const settings = {
    url: BASE_URL
  };

  const p = basicAuthRequest.getUserFromAuthToken(settings);

  t.equal(p instanceof Promise, true, 'is an Promise');

  p.catch((error) => {
    t.equal(error.message, 'Error', 'should be equal');
    t.end();
  });
});
