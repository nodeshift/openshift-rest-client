'use strict';

const fs = require('fs');
const yamlParser = require('../lib/yaml-parser');

const openshiftYml = '/Users/lholmquist/develop/obsidian/wildfly-swarm-openshiftio-boosters/wfswarm-rest-http/target/classes/META-INF/fabric8/openshift.yml';

fs.readFile(openshiftYml, 'utf8', (err, data) => {
  if (err) {
    console.log(err);
    return;
  }

  const parsed = yamlParser.yamlToJson(data);

//  console.log(parsed);

  console.log(parsed.items[1].spec.template.spec);

  // parsed.items[0].spec.template.forEach((item) => {
  //   console.log(item);
  // });
});
