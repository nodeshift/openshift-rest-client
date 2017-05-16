'use strict';

const openshiftClient = require('../');

// const dockerArchive = '/Users/lholmquist/develop/obsidian/wildfly-swarm-openshiftio-boosters/wfswarm-rest-http/target/docker/wfswarm-rest-http/latest/tmp/docker-build.tar';
const dockerArchive = '/Users/lholmquist/develop/nodejs-boosters/nodejs-rest-http/tmp/archive.tar';

const buildConfig = {
  apiVersion: 'v1', // not required
  kind: 'BuildConfig', // not required
  metadata: { // not required
    name: 'nodejs-rest-http-s2i', // This is the build name, i think we can get this from the clint config
    namespace: 'for-node-client-testing', // probably pull this from the client config
    labels: {
      group: 'io.openshift.booster', // Not sure where to get this one?
      project: 'nodejs-rest-http', // get this from the projects package.json
      provider: 'nodejs', // maybe?  this was originall fabric8
      version: '0.0.1' // get this from the projects package.json
    }
  },
  spec: { // required
    triggers: [], // required.  leaving it empty for now
    // runPolicy: Serial // This is optional, defaults to Serial
    source: {// not required
      type: 'Binary', // required
      binary: {} // leaving empty for now
    },
    strategy: { // required
      type: 'Source', // required
      sourceStrategy: { // based on the type above.  just going with source type for now
        from: { // required
          kind: 'DockerImage',
          name: 'bucharestgold/centos7-s2i-nodejs:7.10.0' // Probably replace this with bucharest-gold/nodejs s2i image
        }
      }
    },
    output: { // not required
      to: {
        kind: 'ImageStreamTag',
        name: 'nodejs-rest-http:latest' // proejct name stuff
      }
    }
  },
  status: { // required
    lastVersion: 1 // last triggered build, where to get this number?
  }
};

const imageStreamConfig = {
  apiVersion: 'v1', // not required
  kind: 'ImageStream', // not required
  metadata: { // not required
    name: 'nodejs-rest-http', // This is the stream name, i think we can get this from the clint config
    namespace: 'for-node-client-testing', // probably pull this from the client config
    labels: {
      group: 'io.openshift.booster', // Not sure where to get this one?
      project: 'nodejs-rest-http', // get this from the projects package.json
      provider: 'nodejs', // maybe?  this was originall fabric8
      version: '0.0.1' // get this from the projects package.json
    }
  },
  spec: {} // required
};

// const serviceConfig = {
//   apiVersion: 'v1', // not required
//   kind: 'Service', // not required
//   metadata: { // not required
//     name: 'nodejs-rest-http', // This is the stream name, i think we can get this from the clint config
//     labels: {
//       group: 'io.openshift.booster', // Not sure where to get this one?
//       project: 'nodejs-rest-http', // get this from the projects package.json
//       provider: 'nodejs', // maybe?  this was originall fabric8
//       version: '0.0.1' // get this from the projects package.json
//     }
//   },
//   spec: { // required
//     ports: [
//       {
//         protocol: 'TCP', // TCP is the default, do we need to specifiy
//         port: 8080,
//         targetPort: 8080
//       }
//     ],
//     type: 'ClusterIP' // will default to this if not there
//   }
// };

const buildName = 'nodejs-rest-http-s2i';
const imageName = 'nodejs-rest-http';

openshiftClient().then(client => {
  // Tar code with dockerfile
  // TODO

  // check for build config, create or update if necesarry
  client.buildconfigs.find(buildName).then((response) => {
    if (response.code === 404) {
      // Need to create the build config
      console.log('Creating build config');
      return client.buildconfigs.create(buildConfig);
    }

    console.log('Using current buildConfig');
    return response;
  }).then((response) => {
    console.log('Build Config', response);

    // Check Image stream,  create/update if needed
    return client.imagestreams.find(imageName);
  }).then((imageStream) => {
    console.log(imageStream);
    if (imageStream.code === 404) {
      // Need to create the image stream
      console.log('Creating imagestream');
      return client.imagestreams.create(imageStreamConfig);
    }

    return imageStream;
  }).then((imagestreamResponse) => {
    console.log('Imagestream:', imagestreamResponse);

    // Start the Build
    return client.buildconfigs.instantiateBinary(buildName, {dockerArchive: dockerArchive});
  }).then((buildResponse) => {
    console.log('build response:', buildResponse);
  })
  .catch((err) => {
    console.log(err);
  });

  // Watch the Build

  // Once the build is done,
});
// openshiftClient().then(client => {
//   return client.buildconfigs.instantiateBinary('nodejs-rest-http', {dockerArchive: dockerArchive}).then((imagestreams) => {
//     console.log(imagestreams);
//   });
// }).catch((err) => {
//   console.log('Errored', err);
// });

// openshiftClient().then(client => {
//   return client.buildconfigs.find('nodejs-rest-http-s2i').then((imagestreams) => {
//     console.log(imagestreams);
//   });
// }).catch((err) => {
//   console.log('Errored', err);
// });

// openshiftClient().then(client => {
//   return client.buildconfigs.create(buildConfig).then((build) => {
//     console.log(build);
//   });
// }).catch((err) => {
//   console.log('Errored', err);
// });
