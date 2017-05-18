'use strict';

const request = require('./common-request');

module.exports = {
  find: find
};

function find (client) {
  return function find () {
    const req = {
      method: 'GET',
      url: `${client.apiUrl}/projects`
    };

    return request(client, req);
  };
}
