# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [4.0.0](https://github.com/nodeshift/openshift-rest-client/compare/v3.2.0...v4.0.0) (2020-02-17)


### ⚠ BREAKING CHANGES

* removal of Node 8 support

* engine parameter targets node 10+ ([#194](https://github.com/nodeshift/openshift-rest-client/issues/194)) ([ab0bab4](https://github.com/nodeshift/openshift-rest-client/commit/ab0bab46e705a1eac9279d7f87ffff4f09961875))

## [3.2.0](https://github.com/nodeshift/openshift-rest-client/compare/v3.1.0...v3.2.0) (2020-01-21)


### Features

* load config from a file location. ([#190](https://github.com/nodeshift/openshift-rest-client/issues/190)) ([811a67f](https://github.com/nodeshift/openshift-rest-client/commit/811a67f)), closes [#189](https://github.com/nodeshift/openshift-rest-client/issues/189)

## [3.1.0](https://github.com/nodeshift/openshift-rest-client/compare/v3.0.1...v3.1.0) (2020-01-14)


### Features

* return the kubeconfig on the client ([#186](https://github.com/nodeshift/openshift-rest-client/issues/186)) ([898f2ae](https://github.com/nodeshift/openshift-rest-client/commit/898f2ae))

### [3.0.1](https://github.com/nodeshift/openshift-rest-client/compare/v3.0.0...v3.0.1) (2019-11-19)


### Bug Fixes

* **auth:** Throw some reasonable error message in basic authentication when we can't obtain an access token. ([#174](https://github.com/nodeshift/openshift-rest-client/issues/174)) ([53614e2](https://github.com/nodeshift/openshift-rest-client/commit/53614e2))

## [3.0.0](https://github.com/nodeshift/openshift-rest-client/compare/v2.3.0...v3.0.0) (2019-10-30)


### ⚠ BREAKING CHANGES

* Some API has changed

* This commit updates the client to remove deprecation warnings caused by the kubernetes-clients.  There are some changes to getting external configs.

### Bug Fixes

* remove warnings about deprecations ([#171](https://github.com/nodeshift/openshift-rest-client/issues/171)) ([9f7b379](https://github.com/nodeshift/openshift-rest-client/commit/9f7b379))

## [2.3.0](https://github.com/nodeshift/openshift-rest-client/compare/v2.2.2...v2.3.0) (2019-09-30)


### Features

* **auth:** add optional auth url param to client settings ([#167](https://github.com/nodeshift/openshift-rest-client/issues/167)) ([11df861](https://github.com/nodeshift/openshift-rest-client/commit/11df861))

### [2.2.2](https://github.com/nodeshift/openshift-rest-client/compare/v2.2.1...v2.2.2) (2019-09-11)

### [2.2.1](https://github.com/nodeshift/openshift-rest-client/compare/v2.2.0...v2.2.1) (2019-09-09)

# [2.2.0](https://github.com/nodeshift/openshift-rest-client/compare/v2.1.0...v2.2.0) (2019-04-24)


### Features

* add the service instance endpoint ([#125](https://github.com/nodeshift/openshift-rest-client/issues/125)) ([d0d9374](https://github.com/nodeshift/openshift-rest-client/commit/d0d9374)), closes [#121](https://github.com/nodeshift/openshift-rest-client/issues/121)



# [2.1.0](https://github.com/nodeshift/openshift-rest-client/compare/v2.0.1...v2.1.0) (2019-04-05)


### Features

* use a username/password combo to login ([#118](https://github.com/nodeshift/openshift-rest-client/issues/118)) ([f1098f1](https://github.com/nodeshift/openshift-rest-client/commit/f1098f1)), closes [#117](https://github.com/nodeshift/openshift-rest-client/issues/117)



## [2.0.1](https://github.com/nodeshift/openshift-rest-client/compare/v2.0.0...v2.0.1) (2019-04-01)



# [2.0.0](https://github.com/nodeshift/openshift-rest-client/compare/v1.6.4...v2.0.0) (2019-03-14)


### Features

* Refactor of the library ([#113](https://github.com/nodeshift/openshift-rest-client/issues/113)) ([aa8a6e3](https://github.com/nodeshift/openshift-rest-client/commit/aa8a6e3)), closes [#71](https://github.com/nodeshift/openshift-rest-client/issues/71)


### BREAKING CHANGES

* API is now different

* The API is now generated based on the Openshift Open api spec

* Using the [kubernetes-client](https://github.com/godaddy/kubernetes-client) under the hood

* The api is fluent, for example, client.apis['build.openshift.io'].v1.namespace('default').builds.get()

* Not a drop in replacement for version 1.x



<a name="1.6.4"></a>
## [1.6.4](https://github.com/nodeshift/openshift-rest-client/compare/v1.6.3...v1.6.4) (2019-01-23)


### Bug Fixes

* no cluster url should return a rejected Promise ([fa2a549](https://github.com/nodeshift/openshift-rest-client/commit/fa2a549))
* Throw an error when there's no CLUSTER URL ([#108](https://github.com/nodeshift/openshift-rest-client/issues/108)) ([65093a3](https://github.com/nodeshift/openshift-rest-client/commit/65093a3))



<a name="1.6.3"></a>
## [1.6.3](https://github.com/nodeshift/openshift-rest-client/compare/v1.6.2...v1.6.3) (2019-01-15)



<a name="1.6.2"></a>
## [1.6.2](https://github.com/nodeshift/openshift-rest-client/compare/v1.6.1...v1.6.2) (2018-12-12)



<a name="1.6.1"></a>
## [1.6.1](https://github.com/nodeshift/openshift-rest-client/compare/v1.6.0...v1.6.1) (2018-12-07)


### Bug Fixes

* **common-request.js:** print some meaningful error message in case of unsuccessful authentication ([#99](https://github.com/nodeshift/openshift-rest-client/issues/99)) ([8d6ad07](https://github.com/nodeshift/openshift-rest-client/commit/8d6ad07))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/nodeshift/openshift-rest-client/compare/v1.5.0...v1.6.0) (2018-11-29)


### Features

* add basic authentication option when the token is not provided in user config  ([#92](https://github.com/nodeshift/openshift-rest-client/issues/92)) ([f5778b9](https://github.com/nodeshift/openshift-rest-client/commit/f5778b9)), closes [#89](https://github.com/nodeshift/openshift-rest-client/issues/89)
* Add ServiceInstance resource ([#96](https://github.com/nodeshift/openshift-rest-client/issues/96)) ([6f9b197](https://github.com/nodeshift/openshift-rest-client/commit/6f9b197))
* Add StatefulSet resource ([#93](https://github.com/nodeshift/openshift-rest-client/issues/93)) ([e154ef6](https://github.com/nodeshift/openshift-rest-client/commit/e154ef6))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/nodeshift/openshift-rest-client/compare/v1.4.0...v1.5.0) (2018-10-30)


### Features

* **imagestreamtags:** add resource ([#90](https://github.com/nodeshift/openshift-rest-client/issues/90)) ([fbbf390](https://github.com/nodeshift/openshift-rest-client/commit/fbbf390))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/nodeshift/openshift-rest-client/compare/v1.3.0...v1.4.0) (2018-06-05)


### Bug Fixes

* travis-ci should use npm install instead of npm ci ([#74](https://github.com/nodeshift/openshift-rest-client/issues/74)) ([5d7b59b](https://github.com/nodeshift/openshift-rest-client/commit/5d7b59b))


### Features

* **ingress:** Expose the Ingress api. ([#77](https://github.com/nodeshift/openshift-rest-client/issues/77)) ([c80b457](https://github.com/nodeshift/openshift-rest-client/commit/c80b457)), closes [#73](https://github.com/nodeshift/openshift-rest-client/issues/73)



<a name="1.3.0"></a>
# [1.3.0](https://github.com/nodeshift/openshift-rest-client/compare/v1.2.0...v1.3.0) (2018-05-24)


### Features

* add v1beta1 api endpoints ([#70](https://github.com/nodeshift/openshift-rest-client/issues/70)) ([cb8da7a](https://github.com/nodeshift/openshift-rest-client/commit/cb8da7a))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/nodeshift/openshift-rest-client/compare/v1.1.2...v1.2.0) (2018-05-22)


### Bug Fixes

* **tests:** missing PVC test ([f10cdc8](https://github.com/nodeshift/openshift-rest-client/commit/f10cdc8))


### Features

* **events:** events findAll/find & tests ([14577a2](https://github.com/nodeshift/openshift-rest-client/commit/14577a2))
* **PVC:** add persistent volume claims methods and tests ([306d2b5](https://github.com/nodeshift/openshift-rest-client/commit/306d2b5))



<a name="1.1.2"></a>
## [1.1.2](https://github.com/nodeshift/openshift-rest-client/compare/v1.1.1...v1.1.2) (2018-05-21)



<a name="1.1.1"></a>
## [1.1.1](https://github.com/nodeshift/openshift-rest-client/compare/v1.1.0...v1.1.1) (2018-05-14)


### Bug Fixes

* **package:** update dependecies to fix sshpk security issue, https://nodesecurity.io/advisories/606 ([#65](https://github.com/nodeshift/openshift-rest-client/issues/65)) ([5cde946](https://github.com/nodeshift/openshift-rest-client/commit/5cde946)), closes [#64](https://github.com/nodeshift/openshift-rest-client/issues/64)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/nodeshift/openshift-rest-client/compare/v1.0.1...v1.1.0) (2018-03-20)


### Features

* **build-configs:** Adding instantiate method to buildconfigs ([#60](https://github.com/nodeshift/openshift-rest-client/issues/60)) ([7c86990](https://github.com/nodeshift/openshift-rest-client/commit/7c86990))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/nodeshift/openshift-rest-client/compare/v1.0.0...v1.0.1) (2018-02-19)


### Bug Fixes

* **package:** add hoek directly as a dependecy to fix the security issue - https://nodesecurity.io/advisories/566 ([#57](https://github.com/nodeshift/openshift-rest-client/issues/57)) ([c81fdb5](https://github.com/nodeshift/openshift-rest-client/commit/c81fdb5)), closes [#56](https://github.com/nodeshift/openshift-rest-client/issues/56)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/nodeshift/openshift-rest-client/compare/v0.11.0...v1.0.0) (2018-02-12)


### Features

* include the openshift-config-lodaer. ([2e21e0e](https://github.com/nodeshift/openshift-rest-client/commit/2e21e0e)), closes [#54](https://github.com/nodeshift/openshift-rest-client/issues/54)


### BREAKING CHANGES

* It is no longer necessary to include the openshift-config-loader separate.  By default, just calling the rest client will do the default config loading.
If a user needs to pass a config into the client, use the settings object.  ex:  settings.config = {...}
