'use strict';

const openshiftClient = require('../');

openshiftClient().then(client => {
  console.log(client);

  return client.projects.find().then((projects) => {
    console.log(projects);
  });
}).catch((err) => {
  console.log(`Errored: ${err}`);
});
