# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.0.0"></a>
# [1.0.0](https://github.com/bucharest-gold/openshift-rest-client/compare/v0.11.0...v1.0.0) (2018-02-12)


### Features

* include the openshift-config-lodaer. ([2e21e0e](https://github.com/bucharest-gold/openshift-rest-client/commit/2e21e0e)), closes [#54](https://github.com/bucharest-gold/openshift-rest-client/issues/54)


### BREAKING CHANGES

* It is no longer necessary to include the openshift-config-loader separate.  By default, just calling the rest client will do the default config loading.
If a user needs to pass a config into the client, use the settings object.  ex:  settings.config = {...}
