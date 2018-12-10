'use strict';

/* eslint standard/no-callback-literal: "off" */

const test = require('tape');
const privates = require('../lib/private-map');
const proxyquire = require('proxyquire');

test('test common request - Has a user/pass - Success', (t) => {
  let requestTracker = 0;
  const common = proxyquire('../lib/common-request', {
    request: (requestObject, cb) => {
      if (requestTracker < 1) {
        requestTracker++;

        return cb(null, {
          statusCode: 200,
          request: {
            uri: {
              hash: '#access_token=9jXMEO87d7Rtf6FVQTFjumwIDbGeMzAtr2U010Z_ZG0&expires_in=86400&scope=user%3Afull&token_type=Bearer'
            }
          }
        });
      } else {
        // Testing this here since this i don't believe will be passed to the function that is calling this
        t.equal(requestObject.auth.bearer, '9jXMEO87d7Rtf6FVQTFjumwIDbGeMzAtr2U010Z_ZG0', 'should have a bearer token the same');
        return cb(null, {
          statusCode: 200
        }, requestObject);
      }
    }
  });

  const client = {
    settings: {
      request: {
        strictSSL: false
      }
    },
    config: {
      apiVersion: 'v1',
      context:
       { cluster: '192-168-99-100:8443',
         namespace: 'for-node-client-testing',
         user: 'developer/192-168-99-100:8443' },
      user: {
        username: 'username',
        password: 'password'
      },
      // user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
      cluster: 'https://192.168.99.100:8443' }
  };

  privates.set(client, client);

  common(client).then((req) => {
    t.equal(req.strictSSL, false, 'this value should be false');
    t.end();
  });
});

test('test common request - Has a token - Success', (t) => {
  const common = proxyquire('../lib/common-request', {
    request: (requestObject, cb) => {
      return cb(null, {
        statusCode: 200
      }, requestObject);
    }
  });

  const client = {
    settings: {
      request: {
        strictSSL: false
      }
    },
    config: {
      apiVersion: 'v1',
      context:
       { cluster: '192-168-99-100:8443',
         namespace: 'for-node-client-testing',
         user: 'developer/192-168-99-100:8443' },
      user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
      cluster: 'https://192.168.99.100:8443' }
  };

  privates.set(client, client);

  common(client).then((req) => {
    t.equal(req.auth.bearer, client.config.user.token, 'should have a bearer token the same');
    t.equal(req.strictSSL, false, 'this value should be false');
    t.end();
  });
});

test('test common request - Has a token - Success with 404', (t) => {
  const common = proxyquire('../lib/common-request', {
    request: (requestObject, cb) => {
      return cb(null, {
        statusCode: 404
      }, requestObject);
    }
  });

  const client = {
    settings: {
      request: {
        strictSSL: false
      }
    },
    config: {
      apiVersion: 'v1',
      context:
       { cluster: '192-168-99-100:8443',
         namespace: 'for-node-client-testing',
         user: 'developer/192-168-99-100:8443' },
      user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
      cluster: 'https://192.168.99.100:8443' }
  };

  privates.set(client, client);

  common(client).then((req) => {
    t.equal(req.auth.bearer, client.config.user.token, 'should have a bearer token the same');
    t.equal(req.strictSSL, false, 'this value should be false');
    t.end();
  });
});

test('test common request - Has a token - Request Error', (t) => {
  const common = proxyquire('../lib/common-request', {
    request: (requestObject, cb) => {
      return cb({
        message: 'Some Error',
        code: '0'
      });
    }
  });

  const client = {
    config: {
      apiVersion: 'v1',
      context:
       { cluster: '192-168-99-100:8443',
         namespace: 'for-node-client-testing',
         user: 'developer/192-168-99-100:8443' },
      user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
      cluster: 'https://192.168.99.100:8443' }
  };

  privates.set(client, client);

  common(client).catch((err) => {
    t.equal(err.message, 'Some Error', 'should have the error message');
    t.equal(err.statusCode, '0', 'should have a code of 0');
    t.end();
  });
});

test('test common request - Has a token - body error - as a string', (t) => {
  const common = proxyquire('../lib/common-request', {
    request: (requestObject, cb) => {
      return cb(null, {
        statusCode: 400
      }, 'This is the body error as a string');
    }
  });

  const client = {
    config: {
      apiVersion: 'v1',
      context:
       { cluster: '192-168-99-100:8443',
         namespace: 'for-node-client-testing',
         user: 'developer/192-168-99-100:8443' },
      user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
      cluster: 'https://192.168.99.100:8443' }
  };

  privates.set(client, client);

  common(client).catch((err) => {
    t.equal(err.message, 'This is the body error as a string', 'should have the error message');
    t.end();
  });
});

test('test common request - Has a token - body error - as an object', (t) => {
  const common = proxyquire('../lib/common-request', {
    request: (requestObject, cb) => {
      return cb(null, {
        statusCode: 400
      }, {message: 'This is the body error as an object'});
    }
  });

  const client = {
    config: {
      apiVersion: 'v1',
      context:
       { cluster: '192-168-99-100:8443',
         namespace: 'for-node-client-testing',
         user: 'developer/192-168-99-100:8443' },
      user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
      cluster: 'https://192.168.99.100:8443' }
  };

  privates.set(client, client);

  common(client).catch((err) => {
    t.equal(err.message, 'This is the body error as an object', 'should have the error message');
    t.end();
  });
});

test('test common request - 401 Error', (t) => {
  const common = proxyquire('../lib/common-request', {
    request: (requestObject, cb) => {
      return cb(null, {
        statusCode: 401
      });
    }
  });

  const client = {
    config: {
      apiVersion: 'v1',
      context:
       { cluster: '192-168-99-100:8443',
         namespace: 'for-node-client-testing',
         user: 'developer/192-168-99-100:8443' },
      user: {
        username: 'username',
        password: 'password'
      },
      cluster: 'https://192.168.99.100:8443' }
  };

  privates.set(client, client);

  common(client).catch((err) => {
    t.equal(err.message, '401 Unable to authenticate user username', 'should have the error message');
    t.end();
  });
});

test('test common request - Request Error', (t) => {
  const common = proxyquire('../lib/common-request', {
    request: (requestObject, cb) => {
      return cb({
        message: 'Some Error',
        code: '0'
      });
    }
  });

  const client = {
    config: {
      apiVersion: 'v1',
      context:
       { cluster: '192-168-99-100:8443',
         namespace: 'for-node-client-testing',
         user: 'developer/192-168-99-100:8443' },
      user: {
        username: 'username',
        password: 'password'
      },
      cluster: 'https://192.168.99.100:8443' }
  };

  privates.set(client, client);

  common(client).catch((err) => {
    t.equal(err.message, 'Some Error', 'should have the error message');
    t.equal(err.statusCode, '0', 'should have a code of 0');
    t.end();
  });
});
