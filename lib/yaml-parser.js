'use strict';

const jsyaml = require('js-yaml');

function yamlToJson (fileToParse) {
  // TODO: better error handling
  // Get document, or throw exception on error
  return jsyaml.safeLoad(fileToParse);
}

module.exports = {
  yamlToJson: yamlToJson
};
