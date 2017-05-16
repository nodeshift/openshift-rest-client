'use strict';

const openshiftClient = require('../');

const imageName = 'nodejs-rest-http';

// This is the part of the openshift.yml that is somehow created locally for the swarm booster.  No idea how ATM
// The service.yml(and other .yml's) are somehow "enriched" with some stuff to create this massive yml
// ---
// apiVersion: v1
// kind: List
// items:
// - apiVersion: v1
//   kind: Service
//   metadata:
//     annotations:
//       fabric8.io/git-commit: 5418a547cd2967ba1400f69a063b70724b3eb8c8
//       fabric8.io/scm-con-url: scm:git:https://github.com/openshiftio/booster-parent.git/wfswarm-rest-http
//       prometheus.io/port: "9779"
//       fabric8.io/scm-url: https://github.com/openshiftio/wfswarm-rest-http
//       fabric8.io/git-branch: master
//       prometheus.io/scrape: "true"
//       fabric8.io/scm-devcon-url: scm:git:git:@github.com:openshiftio/booster-parent.git/wfswarm-rest-http
//       fabric8.io/scm-tag: booster-parent-4
//     labels:
//       expose: "true"
//       provider: fabric8
//       project: wfswarm-rest-http
//       version: 7-SNAPSHOT
//       group: io.openshift.booster
//     name: wfswarm-rest-http
//   spec:
//     ports:
//     - name: http
//       port: 8080
//       protocol: TCP
//       targetPort: 8080
//     selector:
//       project: wfswarm-rest-http
//       provider: fabric8
//       group: io.openshift.booster
//     type: ClusterIP

const serviceConfig = {
  apiVersion: 'v1', // not required
  kind: 'Service', // not required
  metadata: { // not required
    name: 'nodejs-rest-http', // This is the stream name, i think we can get this from the clint config
    labels: {
      expose: 'true', // not sure where this one is coming from
      group: 'io.openshift.booster', // Not sure where to get this one?
      project: 'nodejs-rest-http', // get this from the projects package.json
      provider: 'nodejs', // maybe?  this was originall fabric8
      version: '0.0.1' // get this from the projects package.json
    }
  },
  spec: { // required
    ports: [
      {
        name: 'http', // not required if we only have 1 port entry
        protocol: 'TCP', // TCP is the default, do we need to specifiy
        port: 8080,
        targetPort: 8080
      }
    ],
    selector: {
      group: 'io.openshift.booster', // Not sure where to get this one?
      project: 'nodejs-rest-http', // get this from the projects package.json
      provider: 'nodejs' // maybe?  this was originall fabric8
    },
    type: 'ClusterIP' // will default to this if not there
  }
};

const deploymentConfig = {
  apiVersion: 'v1', // not required
  kind: 'DeploymentConfig', // not required
  metadata: { // not required
    name: 'nodejs-rest-http', // This is the stream name, i think we can get this from the clint config
    labels: {
      group: 'io.openshift.booster', // Not sure where to get this one?
      project: 'nodejs-rest-http', // get this from the projects package.json
      provider: 'nodejs', // maybe?  this was originall fabric8
      version: '0.0.1' // get this from the projects package.json
    }
  },
  spec: {
    replicas: 1, // required
    selector: {
      group: 'io.openshift.booster', // Not sure where to get this one?
      project: 'nodejs-rest-http', // get this from the projects package.json
      provider: 'nodejs' // maybe?  this was originall fabric8
    },
    template: {
      metadata: { // not required
        labels: {
          group: 'io.openshift.booster', // Not sure where to get this one?
          project: 'nodejs-rest-http', // get this from the projects package.json
          provider: 'nodejs', // maybe?  this was originall fabric8
          version: '0.0.1' // get this from the projects package.json
        }
      },
      spec: {
        containers: [
          {
            image: 'nodejs-rest-http:latest', // required
            name: 'nodejs', // required
            securityContext: {
              privileged: false
            },
            ports: [
              {
                containerPort: 8080,
                name: 'http',
                protocol: 'TCP'
              }
            ],
            readinessProbe: {
              httpGet: {
                path: '/api/greeting',
                port: 8080,
                scheme: 'HTTP'
              }
            },
            livenessProbe: {
              httpGet: {
                path: '/api/greeting',
                port: 8080,
                scheme: 'HTTP'
              },
              initialDelaySeconds: 60,
              periodSeconds: 30
            }
          }
        ]
      }
    }
  }
};

// apiVersion: v1
// kind: Deployment
// metadata:
//   name: wfswarm-rest-http
// spec:
//   template:
//     spec:
//       containers:
//         - readinessProbe:
//             httpGet:
//               path: /api/greeting
//               port: 8080
//               scheme: HTTP
//           livenessProbe:
//             httpGet:
//               path: /api/greeting
//               port: 8080
//               scheme: HTTP
//             initialDelaySeconds: 60
//             periodSeconds: 30

// - apiVersion: v1
//   kind: DeploymentConfig
//   metadata:
//     annotations:
//       fabric8.io/git-commit: 5418a547cd2967ba1400f69a063b70724b3eb8c8
//       fabric8.io/metrics-path: dashboard/file/kubernetes-pods.json/?var-project=wfswarm-rest-http&var-version=7-SNAPSHOT
//       fabric8.io/scm-con-url: scm:git:https://github.com/openshiftio/booster-parent.git/wfswarm-rest-http
//       fabric8.io/scm-url: https://github.com/openshiftio/wfswarm-rest-http
//       fabric8.io/git-branch: master
//       fabric8.io/scm-devcon-url: scm:git:git:@github.com:openshiftio/booster-parent.git/wfswarm-rest-http
//       fabric8.io/scm-tag: booster-parent-4
//     labels:
//       provider: fabric8
//       project: wfswarm-rest-http
//       version: 7-SNAPSHOT
//       group: io.openshift.booster
//     name: wfswarm-rest-http
//   spec:
//     replicas: 1
//     selector:
//       project: wfswarm-rest-http
//       provider: fabric8
//       version: 7-SNAPSHOT
//       group: io.openshift.booster
//     template:
//       metadata:
//         annotations:
//           fabric8.io/git-commit: 5418a547cd2967ba1400f69a063b70724b3eb8c8
//           fabric8.io/metrics-path: dashboard/file/kubernetes-pods.json/?var-project=wfswarm-rest-http&var-version=7-SNAPSHOT
//           fabric8.io/scm-con-url: scm:git:https://github.com/openshiftio/booster-parent.git/wfswarm-rest-http
//           fabric8.io/scm-url: https://github.com/openshiftio/wfswarm-rest-http
//           fabric8.io/git-branch: master
//           fabric8.io/scm-devcon-url: scm:git:git:@github.com:openshiftio/booster-parent.git/wfswarm-rest-http
//           fabric8.io/scm-tag: booster-parent-4
//         labels:
//           provider: fabric8
//           project: wfswarm-rest-http
//           version: 7-SNAPSHOT
//           group: io.openshift.booster
//       spec:
//         containers:
//         - env:
//           - name: KUBERNETES_NAMESPACE
//             valueFrom:
//               fieldRef:
//                 fieldPath: metadata.namespace
//           - name: AB_JOLOKIA_OFF
//             value: "true"
//           - name: JAVA_APP_DIR
//             value: /deployments
//           - name: AB_OFF
//             value: "true"
//           image: wfswarm-rest-http:latest
//           imagePullPolicy: IfNotPresent
//           livenessProbe:
//             httpGet:
//               path: /api/greeting
//               port: 8080
//               scheme: HTTP
//             initialDelaySeconds: 60
//             periodSeconds: 30
//           name: wildfly-swarm
//           ports:
//           - containerPort: 8080
//             name: http
//             protocol: TCP
//           - containerPort: 9779
//             name: prometheus
//             protocol: TCP
//           - containerPort: 8778
//             name: jolokia
//             protocol: TCP
//           readinessProbe:
//             httpGet:
//               path: /api/greeting
//               port: 8080
//               scheme: HTTP
//           securityContext:
//             privileged: false
//     triggers:
//     - type: ConfigChange
//     - imageChangeParams:
//         automatic: true
//         containerNames:
//         - wildfly-swarm
//         from:
//           kind: ImageStreamTag
//           name: wfswarm-rest-http:latest
//       type: ImageChange

// This is where we get our service/deploymentconfig/route definitions

  // Then look up routes

  // if no routes, then create one

  // Ping service endpoint until something, then finished

openshiftClient().then(client => {
  // Service needs to come first, then deploymentconfig, then route(this exposes)

  // First look up the service by service name
  return client.services.find(imageName).then((service) => {
    if (service.code === 404) {
      // No service, create one
      console.log('Need to create service');
      return client.services.create(serviceConfig);
    }

    console.log('Serivce already created');
    return service;
  }).then(service => {
    console.log('Service', service);

    // Then look up the deploymentconfig
    return client.deploymentconfigs.find(imageName);
  }).then(deployment => {
    // If no deploymentconfig, create one
    if (deployment.code === 404) {
      console.log('Need to create deployment');
      return client.deploymentconfigs.create(deploymentConfig);
    }

    console.log('Deployment already created');
    console.log(deployment);
  }).then((deployment) => {
    console.log(deployment);
  });
});
