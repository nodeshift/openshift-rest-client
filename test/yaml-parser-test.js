'use strict';

const test = require('tape');
const yamlParser = require('../lib/yaml-parser');

test('returns a JSON object from a yaml string', (t) => {
  const someYaml = `
    apiVersion: v1
    kind: Route
    metadata:
      name: wfswarm-rest-http
    spec:
    port:
      targetPort: 8080
    to:
      kind: Service
      name: wfswarm-rest-http`;

  const jsonObject = yamlParser.yamlToJson(someYaml);
  t.equal(typeof jsonObject, 'object', 'returns an object');
  t.equal(jsonObject.apiVersion, 'v1', 'property on object');

  t.end();
});
