const adapt = require('./vue-jscodeshift-adapter/index');
const ImportTransformer = require('./import-transform');

module.exports = adapt(ImportTransformer);