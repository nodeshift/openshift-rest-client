# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.1.0"></a>
# [1.1.0](https://github.com/bucharest-gold/openshift-rest-client/compare/v1.0.1...v1.1.0) (2018-03-20)


### Features

* **build-configs:** Adding instantiate method to buildconfigs ([#60](https://github.com/bucharest-gold/openshift-rest-client/issues/60)) ([7c86990](https://github.com/bucharest-gold/openshift-rest-client/commit/7c86990))



<a name="1.0.1"></a>
## [1.0.1](https://github.com/bucharest-gold/openshift-rest-client/compare/v1.0.0...v1.0.1) (2018-02-19)


### Bug Fixes

* **package:** add hoek directly as a dependecy to fix the security issue - https://nodesecurity.io/advisories/566 ([#57](https://github.com/bucharest-gold/openshift-rest-client/issues/57)) ([c81fdb5](https://github.com/bucharest-gold/openshift-rest-client/commit/c81fdb5)), closes [#56](https://github.com/bucharest-gold/openshift-rest-client/issues/56)



<a name="1.0.0"></a>
# [1.0.0](https://github.com/bucharest-gold/openshift-rest-client/compare/v0.11.0...v1.0.0) (2018-02-12)


### Features

* include the openshift-config-lodaer. ([2e21e0e](https://github.com/bucharest-gold/openshift-rest-client/commit/2e21e0e)), closes [#54](https://github.com/bucharest-gold/openshift-rest-client/issues/54)


### BREAKING CHANGES

* It is no longer necessary to include the openshift-config-loader separate.  By default, just calling the rest client will do the default config loading.
If a user needs to pass a config into the client, use the settings object.  ex:  settings.config = {...}
