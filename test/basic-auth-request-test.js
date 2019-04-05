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

// test('test common request - Has a token - Request Error', (t) => {
//   const common = proxyquire('../lib/common-request', {
//     request: (requestObject, cb) => {
//       return cb({
//         message: 'Some Error',
//         code: '0'
//       });
//     }
//   });

//   const client = {
//     config: {
//       apiVersion: 'v1',
//       context:
//        { cluster: '192-168-99-100:8443',
//          namespace: 'for-node-client-testing',
//          user: 'developer/192-168-99-100:8443' },
//       user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
//       cluster: 'https://192.168.99.100:8443' }
//   };

//   privates.set(client, client);

//   common(client).catch((err) => {
//     t.equal(err.message, 'Some Error', 'should have the error message');
//     t.equal(err.statusCode, '0', 'should have a code of 0');
//     t.end();
//   });
// });

// test('test common request - Has a token - body error - as a string', (t) => {
//   const common = proxyquire('../lib/common-request', {
//     request: (requestObject, cb) => {
//       return cb(null, {
//         statusCode: 400
//       }, 'This is the body error as a string');
//     }
//   });

//   const client = {
//     config: {
//       apiVersion: 'v1',
//       context:
//        { cluster: '192-168-99-100:8443',
//          namespace: 'for-node-client-testing',
//          user: 'developer/192-168-99-100:8443' },
//       user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
//       cluster: 'https://192.168.99.100:8443' }
//   };

//   privates.set(client, client);

//   common(client).catch((err) => {
//     t.equal(err.message, 'This is the body error as a string', 'should have the error message');
//     t.end();
//   });
// });

// test('test common request - Has a token - body error - as an object', (t) => {
//   const common = proxyquire('../lib/common-request', {
//     request: (requestObject, cb) => {
//       return cb(null, {
//         statusCode: 400
//       }, { message: 'This is the body error as an object' });
//     }
//   });

//   const client = {
//     config: {
//       apiVersion: 'v1',
//       context:
//        { cluster: '192-168-99-100:8443',
//          namespace: 'for-node-client-testing',
//          user: 'developer/192-168-99-100:8443' },
//       user: { token: 'zVBd1ZFeJqEAILJgimm4-gZJauaw3PW4EVqV_peEZ3U' },
//       cluster: 'https://192.168.99.100:8443' }
//   };

//   privates.set(client, client);

//   common(client).catch((err) => {
//     t.equal(err.message, 'This is the body error as an object', 'should have the error message');
//     t.end();
//   });
// });

// test('test common request - 401 Error', (t) => {
//   const common = proxyquire('../lib/common-request', {
//     request: (requestObject, cb) => {
//       return cb(null, {
//         statusCode: 401
//       });
//     }
//   });

//   const client = {
//     config: {
//       apiVersion: 'v1',
//       context:
//        { cluster: '192-168-99-100:8443',
//          namespace: 'for-node-client-testing',
//          user: 'developer/192-168-99-100:8443' },
//       user: {
//         username: 'username',
//         password: 'password'
//       },
//       cluster: 'https://192.168.99.100:8443' }
//   };

//   privates.set(client, client);

//   common(client).catch((err) => {
//     t.equal(err.message, '401 Unable to authenticate user username', 'should have the error message');
//     t.end();
//   });
// });

// test('test common request - Request Error', (t) => {
//   const common = proxyquire('../lib/common-request', {
//     request: (requestObject, cb) => {
//       return cb({
//         message: 'Some Error',
//         code: '0'
//       });
//     }
//   });

//   const client = {
//     config: {
//       apiVersion: 'v1',
//       context:
//        { cluster: '192-168-99-100:8443',
//          namespace: 'for-node-client-testing',
//          user: 'developer/192-168-99-100:8443' },
//       user: {
//         username: 'username',
//         password: 'password'
//       },
//       cluster: 'https://192.168.99.100:8443' }
//   };

//   privates.set(client, client);

//   common(client).catch((err) => {
//     t.equal(err.message, 'Some Error', 'should have the error message');
//     t.equal(err.statusCode, '0', 'should have a code of 0');
//     t.end();
//   });
// });
