'use strict';

const test = require('tape');
const proxyquire = require('proxyquire');
const BASE_URL = 'http://some.cluster.com:6443/';

test('basic auth request', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, BASE_URL);
        return Promise.resolve(BASE_URL);
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
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, BASE_URL);
        return Promise.resolve(BASE_URL);
      }
    },
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
      `Unable to authenticate user username to ${BASE_URL}. Cannot obtain access token from response.`,
      'should be equal'
    );
    t.end();
  });
});

test('basic auth request with 401 status code', (t) => {
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, BASE_URL);
        return Promise.resolve(BASE_URL);
      }
    },
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      return cb(null, {
        statusCode: 401,
        request: {
          uri: {
            host: BASE_URL
          }
        }
      });
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
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    './authorization-server-request': {
      getAuthUrlFromOCP: (url, insecureSkipTlsVerify) => {
        t.equal(url, undefined);
        return Promise.resolve(BASE_URL);
      }
    },
    request: (requestObject, cb) => {
      const message = { message: 'Error' };
      return cb(message, {});
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
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      return cb(
        null,
        {
          statusCode: 200
        },
        JSON.stringify({
          kind: 'User',
          metadata: {
            name: 'developer'
          }
        })
      );
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
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      t.equal(
        requestObject.url,
        `${BASE_URL}apis/user.openshift.io/v1/users/~`
      );

      return cb(
        null,
        {
          statusCode: 200
        },
        JSON.stringify({
          kind: 'User',
          metadata: {
            name: 'developer'
          }
        })
      );
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
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    request: (requestObject, cb) => {
      t.equal(requestObject.strictSSL, false, 'should be false');
      return cb(null, {
        statusCode: 401,
        request: {
          uri: {
            host: BASE_URL
          }
        }
      });
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
  const basicAuthRequest = proxyquire('../lib/basic-auth-request', {
    request: (requestObject, cb) => {
      const message = { message: 'Error' };
      return cb(message, {});
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
