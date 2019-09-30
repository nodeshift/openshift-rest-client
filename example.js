const { OpenshiftClient: openshiftRestClient, config } = require('.');

// async function genericTryCatch (fn) {
//   let result;
//   try {
//     result = await fn;
//   } catch (err) {
//     if (err.code === 404) {
//       return Promise.reject(err);
//     }
//     result = err;
//   }

//   return result;
// }

// console.log(config);

// OpenshiftClient().then(async (client) => {
//   // Use the client object to find a list of projects, for example
//   let bc = await genericTryCatch(client.apis.build.v1.ns('myproject').buildconfigs('nodejs-rest-http-s2i').delete());
//   console.log(bc);
// });

// const openshiftRestClient = require('openshift-rest-client').OpenshiftClient;

const otherConfig = config.fromKubeconfig();

console.log(otherConfig);

openshiftRestClient().then((client) => {
  // Use the client object to find a list of projects, for example
  client.apis['project.openshift.io'].v1.project.get().then((response) => {
    console.log(response.body);
  });
});
